interface FAQ {
  category: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    category: "General",
    question: "What is digital solar?",
    answer:
      "Digital Solar is a service that enables residential individuals and groups to reserve solar capacity from commercial scale pay-for-use solar projects to trade power for bill credits, and in doing so, allows individuals to use these credits to save up on their power bills.",
  },
  {
    category: "General",
    question: "Where are these digital solar capacity installed?",
    answer:
      "Digital Solar Projects can be installed in various locations in India where net metering and RESCO projects are permissible. Current systems are installed in Bengaluru and Mumbai.",
  },
  {
    category: "General",
    question: "Do I need any approval from my DISCOM to use your service?",
    answer:
      "Utilities that are listed on our platform are enabled for addition of credits to power bills. For them, no additional permissions or requirements are necessary nor needs any changes to the building power meter.",
  },
  {
    category: "Reserving Solar",
    question: "How do I get digital solar?",
    answer:
      "You can reserve Digital Solar capacity from one of our available projects. Once you reserve, the power generated from your reservation will be traded into bill credits which can be used to save up on your monthly power bill.",
  },
  {
    category: "Reserving Solar",
    question: "Can I make reservations in batches?",
    answer:
      "Yes. You can reserve from the same project or from multiple other projects (if available) in batches. This works great especially for reserving more if power bills increase or want to get accustomed to digital solar first with a smaller batch.",
  },
  {
    category: "Reserving Solar",
    question: "Can I exit my reservation before the term period?",
    answer:
      "Yes. As a service, this is one of the key highlights of digital solar from rooftop installations which are fixed. In case the user has to exit reservation due to shift of location to an area not serviceable by us or for other reasons, they could exit the project and get a refund processed based upon the tenure of their reservation.",
  },
  {
    category: "Using Credits",
    question: "How do I connect credits to my power bills?",
    answer:
      "Simply pay your power bill through PowerNetPro (the process is much like using payment apps such as Google Pay and Paytm to pay for power) and credits get automatically added to that due bill.",
  },
  {
    category: "Using Credits",
    question: "Can I withdraw my credits as cash?",
    answer:
      "On-bill credits are used to add on top of power bills to discount them and in present form can't be withdrawn or transferred to a bank account.",
  },
  {
    category: "Using Credits",
    question: "Can I pay multiple power bills or bills on others behalf?",
    answer:
      "Yes, credits can be used for multiple billing sessions; either for individual requirements or for others.",
  },
];