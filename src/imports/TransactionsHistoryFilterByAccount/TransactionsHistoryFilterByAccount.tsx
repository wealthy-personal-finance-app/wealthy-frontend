function Title() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Title">
      <p className="font-['Inter_Tight:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#717784] text-[14px] whitespace-nowrap">Cash Account</p>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative" data-name="Text">
      <Title />
    </div>
  );
}

function RadioLabel() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Radio Label [1.0]">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Checkbox">
        <div className="absolute bg-[#0f0f0f] inset-[10%] rounded-[4px]" data-name="bg" />
        <div className="absolute bg-[#1f2220] border border-[#2e2f33] border-solid inset-[17.5%] rounded-[2.5px]" data-name="box" />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Text />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <RadioLabel />
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Title">
      <p className="font-['Inter_Tight:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#717784] text-[14px] whitespace-nowrap">Bank Account</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative" data-name="Text">
      <Title1 />
    </div>
  );
}

function RadioLabel1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Radio Label [1.0]">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Checkbox">
        <div className="absolute bg-[#0f0f0f] inset-[10%] rounded-[4px]" data-name="bg" />
        <div className="absolute bg-[#1f2220] border border-[#2e2f33] border-solid inset-[17.5%] rounded-[2.5px]" data-name="box" />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Text1 />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <RadioLabel1 />
    </div>
  );
}

function Title2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Title">
      <p className="font-['Inter_Tight:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#717784] text-[14px] whitespace-nowrap">Current Account</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative" data-name="Text">
      <Title2 />
    </div>
  );
}

function RadioLabel2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Radio Label [1.0]">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Checkbox">
        <div className="absolute bg-[#0f0f0f] inset-[10%] rounded-[4px]" data-name="bg" />
        <div className="absolute bg-[#1f2220] border border-[#2e2f33] border-solid inset-[17.5%] rounded-[2.5px]" data-name="box" />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Text2 />
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <RadioLabel2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <Frame2 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 248 1">
            <line id="Line 163" stroke="var(--stroke-0, #2E2F33)" strokeLinecap="round" x1="0.5" x2="247.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame1 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 248 1">
            <line id="Line 163" stroke="var(--stroke-0, #2E2F33)" strokeLinecap="round" x1="0.5" x2="247.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame3 />
    </div>
  );
}

export default function TransactionsHistoryFilterByAccount() {
  return (
    <div className="bg-[#0f0f0f] relative rounded-[16px] size-full" data-name="Transactions-History-Filter by Account">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[16px] relative rounded-[inherit] size-full">
        <Frame />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2e2f33] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_100px_0px_rgba(10,10,57,0.15)]" />
    </div>
  );
}