import React, { useState, useEffect, useCallback } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { ChevronDown, Calendar, TrendingUp, TrendingDown, Activity, ChevronLeft, ZoomIn } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { toast } from 'sonner';
import mockData from '../../data/mockCashflowData.json';

interface SankeyNode {
  id: string;
  color?: string;
  cluster?: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface ChartData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface CashflowData {
  nodes: SankeyNode[];
  links: SankeyLink[];
  drilldown: Record<string, ChartData>;
  summary: {
    totalIn: number;
    totalOut: number;
    netFlow: number;
  };
}

// --- Drillable node IDs (all except the hub) ---
const DRILLABLE_NODES = new Set([
  'Active Income', 'Asset Income', 'Other Income',
  'Essential Living', 'Obligations & Liabilities',
  'Discretionary & Lifestyle', 'Growth & Giving', 'Unplanned',
]);

function StatCard({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any }) {
  return (
    <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[12px] px-[20px] py-[16px] flex-1 flex items-center gap-[16px]">
      <div className="size-[44px] rounded-[10px] bg-[#101214] border border-[#2e2f33] flex items-center justify-center shrink-0">
        <Icon size={20} color={color} />
      </div>
      <div className="flex flex-col gap-[4px]">
        <p className="text-[#717784] text-[13px] font-medium font-['Inter_Tight',sans-serif]">{label}</p>
        <p className="text-[22px] font-bold font-['Inter_Tight',sans-serif]">
          <span className="text-white">LKR </span>
          <span style={{ color }}>{value.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}

export function CashflowPage() {
  const [data, setData] = useState<CashflowData | null>(null);
  const [period, setPeriod] = useState('april-2026');
  const [loading, setLoading] = useState(true);

  // Drill-down state
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    async function fetchCashflowData() {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setData(mockData as CashflowData);
      } catch (error) {
        console.error('Error fetching cashflow data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCashflowData();
  }, [period]);

  // Reset drilldown on period change
  useEffect(() => {
    setActiveCategory(null);
  }, [period]);

  const periods = [
    { value: 'april-2026', label: 'April 2026' },
    { value: 'march-2026', label: 'March 2026' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'all-time', label: 'All time' },
  ];

  const triggerTransition = useCallback((fn: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      fn();
      setIsTransitioning(false);
    }, 250);
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    if (!data) return;
    const nodeId = node.id;
    if (activeCategory !== null) return; // Already at Level 2 — no deeper
    if (!DRILLABLE_NODES.has(nodeId)) return; // Hub node — not drillable
    if (!data.drilldown[nodeId]) return;

    triggerTransition(() => {
      setActiveCategory(nodeId);
      toast.info(`Zooming into "${nodeId}"`, { duration: 2000 });
    });
  }, [data, activeCategory, triggerTransition]);

  const handleBackToOverview = useCallback(() => {
    triggerTransition(() => {
      setActiveCategory(null);
    });
  }, [triggerTransition]);

  if (loading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  // Determine which chart data to show
  const isDetailView = activeCategory !== null;
  const chartData: ChartData = isDetailView && data.drilldown[activeCategory]
    ? data.drilldown[activeCategory]
    : { nodes: data.nodes, links: data.links };

  // Determine the accent color of the active category
  const activeCategoryColor = isDetailView
    ? (data.nodes.find(n => n.id === activeCategory)?.color || '#606980')
    : null;

  // Summary cards for drilldown: show the split of that category's sub-items
  const drilldownTotal = isDetailView
    ? (data.drilldown[activeCategory]?.links.reduce((sum, l) => sum + l.value, 0) ?? 0)
    : 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-[32px] gap-[16px] scrollbar-hide">

      {/* Overview Cards Row */}
      <div className="flex gap-[16px] w-full shrink-0">
        {isDetailView ? (
          <>
            <StatCard
              label={`${activeCategory} — Total`}
              value={drilldownTotal}
              color={activeCategoryColor!}
              icon={ZoomIn}
            />
            <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[12px] px-[20px] py-[16px] flex-1 flex items-center gap-[16px]">
              <div className="size-[44px] rounded-[10px] bg-[#101214] border border-[#2e2f33] flex items-center justify-center shrink-0">
                <Activity size={20} color="#606980" />
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[#717784] text-[13px] font-medium font-['Inter_Tight',sans-serif]">Sub-categories</p>
                <p className="text-[22px] font-bold font-['Inter_Tight',sans-serif]">
                  <span style={{ color: activeCategoryColor! }}>
                    {chartData.links.length}
                  </span>
                  <span className="text-[#717784] text-[14px] font-medium ml-[6px]">items</span>
                </p>
              </div>
            </div>
            <div className="bg-[#191b1f] border border-[#2e2f33] rounded-[12px] px-[20px] py-[16px] flex-1 flex items-center gap-[16px]">
              <div className="size-[44px] rounded-[10px] bg-[#101214] border border-[#2e2f33] flex items-center justify-center shrink-0">
                <TrendingDown size={20} color="#717784" />
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[#717784] text-[13px] font-medium font-['Inter_Tight',sans-serif]">Largest Item</p>
                <p className="text-[22px] font-bold font-['Inter_Tight',sans-serif]">
                  <span className="text-white">LKR </span>
                  <span style={{ color: activeCategoryColor! }}>
                    {Math.max(...chartData.links.map(l => l.value)).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <StatCard label="Total In" value={data.summary.totalIn} color="#10B981" icon={TrendingUp} />
            <StatCard label="Total Out" value={data.summary.totalOut} color="#EF4444" icon={TrendingDown} />
            <StatCard label="Net Flow" value={data.summary.netFlow} color="#3B82F6" icon={Activity} />
          </>
        )}
      </div>

      {/* Main Sankey Card */}
      <div className="flex-1 bg-[#191b1f] border border-[#2e2f33] rounded-[16px] p-[40px] flex flex-col relative min-h-[600px]">

        {/* Card Header */}
        <div className="flex justify-between items-center mb-[40px] shrink-0">
          <div className="flex flex-col gap-[8px]">
            {/* Breadcrumb */}
            {isDetailView && (
              <button
                onClick={handleBackToOverview}
                className="flex items-center gap-[6px] text-[#717784] hover:text-white transition-colors w-fit group"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[12px] font-medium font-['Inter_Tight',sans-serif]">Back to Overview</span>
              </button>
            )}
            <div className="flex items-center gap-[10px]">
              <div>
                <h1 className="text-white text-[20px] font-semibold font-['Inter_Tight',sans-serif]">
                  {isDetailView ? activeCategory : 'Cash Flow Pipeline'}
                </h1>
                <p className="text-[#717784] text-[13px]">
                  {isDetailView
                    ? `Breakdown of ${activeCategory} spending`
                    : 'Visualized movement of funds across your ecosystem'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[16px]">
            {/* Level badge */}
            <div className={`px-[10px] py-[4px] rounded-full text-[11px] font-semibold font-['Inter_Tight',sans-serif] border transition-all ${
              isDetailView
                ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]'
                : 'bg-white/[0.03] border-white/[0.06] text-[#717784]'
            }`}>
              {isDetailView ? 'Level 2 — Detail' : 'Level 1 — Overview'}
            </div>

            {/* Legend */}
            {!isDetailView && (
              <div className="flex gap-[16px] items-center">
                <div className="flex items-center gap-[6px]">
                  <div className="size-[8px] rounded-full bg-[#10B981]" />
                  <span className="text-[#99a0ae] text-[11px] font-medium uppercase tracking-wider">Inflows</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <div className="size-[8px] rounded-full bg-[#EF4444]" />
                  <span className="text-[#99a0ae] text-[11px] font-medium uppercase tracking-wider">Outflows</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hint banner — only on overview */}
        {!isDetailView && (
          <div className="flex items-center gap-[8px] mb-[24px] px-[12px] py-[8px] bg-white/[0.02] border border-white/[0.05] rounded-[8px] w-fit shrink-0">
            <ZoomIn size={13} className="text-[#606980]" />
            <span className="text-[#717784] text-[12px] font-medium font-['Inter_Tight',sans-serif]">
              Click any category node to drill down into its sub-categories
            </span>
          </div>
        )}

        {/* The Sankey Chart — fades on transition */}
        <div
          className="flex-1 w-full relative transition-opacity duration-250"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <ResponsiveSankey
            data={chartData}
            margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
            align="justify"
            colors={(node: any) => node.color || '#606980'}
            nodeOpacity={1}
            nodeThickness={18}
            nodeInnerPadding={2}
            nodeSpacing={40}
            nodeBorderWidth={0}
            nodeBorderRadius={4}
            linkOpacity={0.35}
            linkHoverOpacity={0.65}
            linkHoverOthersOpacity={0.1}
            enableLinkGradient={true}
            labelPosition="outside"
            labelOrientation="horizontal"
            labelPadding={20}
            labelTextColor="#99a0ae"
            onClick={handleNodeClick}
            theme={{
              tooltip: {
                container: {
                  background: '#101214',
                  color: '#fff',
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid #2e2f33',
                  padding: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                },
              },
              labels: {
                text: {
                  fontFamily: 'Inter Tight, sans-serif',
                  fontWeight: 600,
                  fontSize: 13,
                  fill: '#E1E4EA',
                  cursor: 'pointer',
                },
              },
            }}
            valueFormat={value => `LKR ${value.toLocaleString()}`}
          />
        </div>

        {/* Bottom Bar */}
        <div className="mt-[32px] pt-[20px] border-t border-white/[0.03] flex justify-between items-center">
          {isDetailView ? (
            <button
              onClick={handleBackToOverview}
              className="flex items-center gap-[8px] px-[14px] py-[8px] bg-white/[0.03] hover:bg-white/[0.06] border border-[#2e2f33] rounded-[8px] text-[#99a0ae] hover:text-white text-[13px] font-medium font-['Inter_Tight',sans-serif] transition-all"
            >
              <ChevronLeft size={14} />
              Back to Overview
            </button>
          ) : (
            <div className="flex items-center gap-[24px]">
              <div className="flex items-center gap-[8px]">
                <div className="size-[10px] rounded-[2px] bg-[#10B981]" />
                <span className="text-[#99a0ae] text-[12px] font-medium">Income Flow</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="size-[10px] rounded-[2px] bg-[#EF4444]" />
                <span className="text-[#99a0ae] text-[12px] font-medium">Expense Flow</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="size-[10px] rounded-[2px] bg-[#606980]" />
                <span className="text-[#99a0ae] text-[12px] font-medium">Cash Flow Hub</span>
              </div>
            </div>
          )}

          <Select.Root value={period} onValueChange={(val) => {
            setPeriod(val);
            const label = periods.find(p => p.value === val)?.label;
            toast.info(`Showing cash flow for ${label}`);
          }}>
            <Select.Trigger className="bg-[#101214] border border-[#2e2f33] rounded-[10px] h-[36px] px-[12px] flex items-center gap-[8px] text-white text-[13px] font-medium outline-none hover:bg-white/[0.04] transition-colors cursor-pointer">
              <Calendar size={14} className="text-[#717784]" />
              <Select.Value />
              <Select.Icon>
                <ChevronDown size={14} className="text-[#717784]" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="z-50 bg-[#101214] border border-[#2e2f33] rounded-[12px] p-[6px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <Select.Viewport>
                  {periods.map(p => (
                    <Select.Item
                      key={p.value}
                      value={p.value}
                      className="flex items-center px-[24px] py-[8px] rounded-[8px] text-[13px] text-[#99a0ae] hover:text-white hover:bg-white/[0.04] outline-none cursor-pointer relative select-none"
                    >
                      <Select.ItemText>{p.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

      </div>
    </div>
  );
}
