export interface TermSection {
  id: number;
  title: string;
  paragraphs: string[];
}

export const ORGANISER_TERMS_METADATA = {
  title: 'PASS NO JUGAAD',
  subtitle: 'Organiser Terms & Conditions',
  intro:
    'These Organiser Terms & Conditions (“Terms”) govern access to and use of the Pass No Jugaad website (the “Platform”) by persons who register on the Platform or list an event on it. In these Terms, “Pass No Jugaad”, “we” and “us” refer to the owner and operator of the Platform.\n\nBy registering as an organiser, submitting or listing an event, or clicking “I Agree” (or any similar button) on the Platform, you (the “Organiser”) confirm that you have read, understood and accepted these Terms. If you do not accept these Terms, you must not register or list any event on the Platform.',
};

export const ORGANISER_TERMS_SECTIONS: TermSection[] = [
  {
    id: 1,
    title: '1. Definitions and Role of the Platform',
    paragraphs: [
      'In these Terms, unless the context requires otherwise:',
      '• “Event” means any event, show, experience or activity listed by an Organiser on the Platform.\n• “Pass” means any ticket, pass, entry right or other admission credential for an Event made available for purchase through the Platform.\n• “User” means any person who browses the Platform or purchases or seeks to purchase a Pass.\n• “Content” means all images, logos, trademarks, videos, audio, text, artist details and other material uploaded or submitted by the Organiser to the Platform.\n• “User Data” means any personal data of Users made available to the Organiser through the Platform.',
      'Pass No Jugaad acts solely as an online intermediary and marketplace that enables Organisers to list Events and Users to purchase Passes. The contract for the sale of a Pass and for attendance at an Event is between the Organiser and the User. Pass No Jugaad does not organise, host, sponsor, endorse or control any Event, and is not a party to that contract. Nothing in these Terms creates any agency, partnership, joint venture or employment relationship between Pass No Jugaad and the Organiser.',
    ],
  },
  {
    id: 2,
    title: '2. Accuracy of Information',
    paragraphs: [
      'The Organiser represents and warrants that all information submitted in respect of an Event, including its title, date, venue, timings, pricing, sponsorships, artist line-up, age or entry restrictions, inclusions, posters, images, refund policy and availability of Passes, is true, accurate, complete and not misleading, and shall keep such information updated at all times.',
      'The Organiser shall immediately inform Pass No Jugaad of, and correct, any inaccuracy, and is solely liable for any loss arising from inaccurate or misleading information.',
    ],
  },
  {
    id: 3,
    title: '3. Responsibility for the Event',
    paragraphs: [
      'The Organiser is solely and exclusively responsible for planning, conducting and managing the Event, including venue arrangements, entry management, validation and honouring of Passes, crowd control, safety and security, any changes to the Event, and the fulfilment of all commitments made to Users.',
      'The Organiser shall obtain and maintain, at its own cost, all licences, permissions and approvals required under applicable law for the Event, including police, fire, local authority and venue permissions, music and copyright licences, alcohol licences (where relevant) and any applicable entertainment-related registrations.',
    ],
  },
  {
    id: 4,
    title: '4. Event Review and Approval',
    paragraphs: [
      'Every Event submitted to the Platform is subject to review and approval by Pass No Jugaad, before or after publication. Pass No Jugaad may, in its sole discretion and with or without notice, reject, hide, delist or remove any Event or listing, and may edit a listing for format, clarity or presentation.',
      'Approval or publication of a listing does not constitute verification of its accuracy or legality and does not relieve the Organiser of any responsibility under these Terms.',
    ],
  },
  {
    id: 5,
    title: '5. Verification and Documents',
    paragraphs: [
      'Pass No Jugaad may request such documents and information as it reasonably requires to verify an Organiser or an Event, including identity and business details, event permissions, venue confirmation, proof of the Organiser’s authority to sell Passes, ticketing arrangements, contact details and payment or settlement details.',
      'The Organiser shall provide the requested information promptly, and it must be true, complete and kept up to date. Failure to provide it, or the submission of false or forged documents, may result in action in accordance with clause 4. Pass No Jugaad may use and share such information only as required for verification, payment processing, fraud prevention or compliance with law. Verification does not amount to an endorsement or guarantee by Pass No Jugaad of the Organiser or the Event.',
    ],
  },
  {
    id: 6,
    title: '6. Genuine Passes',
    paragraphs: [
      'The Organiser shall make available only genuine, valid and enforceable Passes and shall honour every Pass sold through the Platform. The Organiser is solely responsible for the authenticity, validity and fulfilment of all Passes or access rights supplied for its Events.',
      'The Organiser shall not create, issue or sell duplicate, counterfeit, oversold or misleading Passes, or Passes it has no authority to sell. Any fraudulent, duplicate or misleading Pass or Pass information is strictly prohibited and shall entitle Pass No Jugaad to act under clause 4 & 12, without prejudice to any other remedy available under law.',
    ],
  },
  {
    id: 7,
    title: '7. Fees, Payments and Taxes',
    paragraphs: [
      'The Organiser shall pay Pass No Jugaad the commission, convenience fee and any other charges applicable to the Organiser’s Events, as displayed on the Platform or communicated to the Organiser at onboarding or in writing (including by email).',
      'Unless expressly stated otherwise on the Platform, Pass No Jugaad does not collect, hold or handle any amount paid by Users for Passes, and the Organiser is solely responsible for the collection, settlement and refund of all such amounts, whether directly or through a third-party ticketing or payment service. Pass No Jugaad may withhold, delay, reserve or set off any amount payable to the Organiser to the extent required to cover refunds, chargebacks, User claims, penalties or other amounts due from the Organiser, or pending investigation of suspected fraud or breach of these Terms.',
      'The Organiser is solely responsible for determining, collecting, reporting and paying all taxes, duties and levies applicable to the Event and to the sale of Passes (including GST and any entertainment-related taxes), and for issuing any invoices required by law.',
    ],
  },
  {
    id: 8,
    title: '8. Changes, Postponement and Cancellation',
    paragraphs: [
      'The Organiser shall inform Pass No Jugaad in writing immediately (and in any case within 24 hours) of any material change to, or postponement, rescheduling or cancellation of, an Event, including any change of date, venue, timing or announced artist line-up. The Organiser shall also update the Event listing without delay so that Users are not misled. Pass No Jugaad may notify affected Users and may suspend further sales of Passes for the Event.',
    ],
  },
  {
    id: 9,
    title: '9. Refunds and User Grievances',
    paragraphs: [
      'Refunds shall be handled in accordance with the Organiser’s refund policy as stated on the Event listing, which must be clear, must be displayed before a User purchases a Pass, and must not be inconsistent with applicable law, including consumer protection law. Where an Event is cancelled, or is postponed or materially changed such that Users are entitled to a refund, the Organiser shall bear the cost of all such refunds, including payment gateway charges and the Platform’s convenience fee.',
      'The Organiser shall respond promptly and in good faith to User queries and complaints relating to its Events and shall cooperate with Pass No Jugaad in resolving them. Pass No Jugaad is not responsible for funding from its own resources any refund that is required to be borne by the Organiser.',
    ],
  },
  {
    id: 10,
    title: '10. Images, Content and Intellectual Property',
    paragraphs: [
      'The Organiser represents and warrants that it owns, or has obtained all necessary rights, licences and consents for, all Content it uploads to the Platform, and that the Content does not infringe the intellectual property, privacy, publicity or other rights of any third party and is not defamatory, obscene or otherwise unlawful.',
      'The Organiser grants Pass No Jugaad a non-exclusive, worldwide, royalty-free licence to use, reproduce, display and promote the Content in connection with the operation and marketing of the Platform and the Event. The Organiser shall indemnify Pass No Jugaad against all claims, losses and costs arising from the Content.',
    ],
  },
  {
    id: 11,
    title: '11. User Data',
    paragraphs: [
      'User Data may be used by the Organiser only for legitimate purposes directly connected with administering and conducting the relevant Event and providing services the User has requested. The Organiser shall not sell, share, publish or otherwise use User Data for any unrelated purpose (including marketing) without the User’s lawful consent.',
      'The Organiser shall maintain reasonable security safeguards for User Data, comply with applicable data protection law (including the Digital Personal Data Protection Act, 2023 and the rules made under it, as and when applicable), notify Pass No Jugaad without delay of any unauthorised access to or loss of User Data, and delete or return User Data once it is no longer required for the Event.',
    ],
  },
  {
    id: 12,
    title: '12. Suspension, Removal and Termination',
    paragraphs: [
      'Pass No Jugaad may, with or without notice, suspend or terminate an Organiser’s account or access, remove any Event, where it (a) receives complaints against the Organiser or an Event; (b) identifies misleading information or suspected fraudulent activity; (c) has reason to believe that the Event, the Content or the Organiser violates applicable law or these Terms; or (d) is required to do so by a court, regulator or law enforcement agency. Such action is without prejudice to any other right or remedy available to Pass No Jugaad.',
      'Suspension or termination does not affect the Organiser’s obligation to honour Passes already sold or to process refunds due to Users.',
    ],
  },
  {
    id: 13,
    title: '13. Third-Party Services',
    paragraphs: [
      'Where Passes, ticketing, payment processing or other services are provided through a third-party platform or service provider, that third party’s applicable terms and policies shall also apply to the Organiser and the Event. Pass No Jugaad is not responsible for the acts, omissions, downtime or failure of any such third party.',
    ],
  },
  {
    id: 14,
    title: '14. Platform Availability',
    paragraphs: [
      'Pass No Jugaad shall make reasonable efforts to keep the Platform available but does not guarantee uninterrupted or error-free operation. The Platform may be unavailable from time to time because of maintenance, updates, technical or security issues, failure of third-party or telecommunications services, or circumstances beyond its reasonable control.',
      'To the extent permitted by law, Pass No Jugaad shall not be liable for any loss arising from such unavailability, and the Organiser shall make its own arrangements for entry and Pass validation at the Event so that the Event is not affected.',
    ],
  },
  {
    id: 15,
    title: '15. Authority and Acceptance',
    paragraphs: [
      'By registering on the Platform or submitting an Event, the Organiser confirms that (a) it has the legal capacity and authority to accept these Terms and to list the Event and sell Passes for it; (b) if it is acting on behalf of a company, firm or other entity, the individual accepting these Terms is duly authorised to bind that entity; and (c) it accepts and agrees to be bound by these Terms.',
      'This acceptance may be made electronically and constitutes an electronic record and binding acceptance under the Information Technology Act, 2000 where no physical or digital signature is required. Acceptance of these Terms may also be given by email or in any other written or electronic form, and any such acceptance shall be equally binding on the Organiser, whether or not it is made through the Platform.',
    ],
  },
  {
    id: 16,
    title: '16. Amendments',
    paragraphs: [
      'Pass No Jugaad may update or modify these Terms from time to time. The updated Terms will be published on the Platform with the revised “Last updated” date, and the Organiser will be notified of material changes by email or through the Platform.',
      'Continued use of the Platform or listing of any Event after the updated Terms take effect constitutes acceptance of them. Events already listed and Passes already sold shall continue to be governed by the Terms in force at the time of listing, unless the change is required by law.',
    ],
  },
  {
    id: 17,
    title: '17. Governing Law and Jurisdiction',
    paragraphs: [
      'These Terms are governed by the laws of India. Subject to applicable law, the courts at Ahmedabad, Gujarat, India shall have exclusive jurisdiction over any dispute arising out of or in connection with these Terms.',
    ],
  },
];
