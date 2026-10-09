# Foundation Framework church pilot specification

Build the next release around one church completing real challenges with teens and designated adult reviewers. The first backend milestone is a complete loop: a teen signs in, practices a challenge, requests review, receives feedback, and earns an adult-approved completion that persists across devices.

“Faithful in the everyday.” is the program tagline. The theme verse is 1 Corinthians 3:11. Christ-centered formation, practical competence, and faithful service remain the purpose; progress indicators help organize that work.

## Pilot scope and proposed defaults

Use one church, 5–10 teens, 2–3 adult mentors, and one church coordinator for a four-week pilot. These are proposed planning defaults, not enrollment commitments. Review the seven Foundation 7 challenges before launch; the guided path stays optional. Enable other Apprentice challenges only after church review. No time-based streaks or competitive rankings.

The current prototype has 16 sample Apprentice challenges and browser-only checklist progress. Its “Ready” state is personal readiness, not an approved completion. Accounts, church membership, adult approval, and persistent storage do not yet exist. Retain the public static site and sample curriculum while the authenticated experience is built.

One person can have several roles. Access comes from both church membership and explicit participant relationships. A mentor who is also a parent can use both capabilities without holding two accounts.

## Completion workflow

1. **Choose and begin.** A teen starts any enabled challenge. A mentor can recommend a challenge; a recommendation is not a prerequisite. Starting creates an attempt pinned to the published curriculum version.
2. **Learn and practice.** The teen saves checklist progress and brief structured practice notes. The assigned mentor helps and can see the attempt. For independently signed-in teens, adults do not mark the checklist on their behalf. The platform plan proposes an explicitly attributed guardian-assisted workspace for participant profiles without email; confirm that exception before implementation.
3. **Prepare for review.** Checking every required item shows “Ready to demonstrate,” provided no more-practice feedback remains outstanding. Unchecking an item returns the attempt to “Working on.” Readiness never awards completion.
4. **Request review.** The teen confirms the checklist, identifies the designated reviewer, and submits a short demonstration summary. Submission records an immutable snapshot of the attempt revision. The workshop shows “Review requested.” While submitted, the checklist is read-only. The teen can withdraw a pending request to continue practicing.
5. **Demonstrate and review.** The reviewer observes the work, uses the challenge’s criteria, and either approves it or requests more practice. A review requires a short explanation; it is visible to the teen and the assigned adults. Requesting practice returns the attempt to “Working on,” keeps existing checklist entries, and records the feedback. The teen records the additional practice and acknowledges the feedback before becoming ready to request review again. This does not imply adult approval.
6. **Approve.** Approval creates a completion record with participant, challenge version, reviewer, date, and demonstration summary. The attempt shows “Completed.” Print records and completion totals count these approved records.
7. **Continue.** Finishing Foundation 7 replaces its starting prompt with a completion message and a suggestion to explore the remaining enabled challenges. It does not award Apprentice or unlock another level automatically. Level completion will need a separately defined curriculum policy.

A mentor relationship does not itself grant sign-off authority. The church coordinator explicitly designates qualified reviewers for particular participants and challenges, or a reviewed challenge group. Parent status alone does not grant approval. The teen cannot approve their own work, even if their account has another role.

Approved attempts are locked. The coordinator can revoke an erroneous approval with a recorded reason; history remains visible, totals update, and the attempt returns for practice or review. Correcting approval is a separate action from editing curriculum or checklist progress.

### Workshop presentation

| Position             | What the participant sees                                | What it means                                     |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------- |
| Choose next          | Enabled challenges and optional Foundation 7 suggestions | No attempt yet                                    |
| Working on           | Checklist progress and next practice step                | Active attempt                                    |
| Ready to demonstrate | Review request button                                    | Checklist ready, no submission yet                |
| Ready to demonstrate | Review requested label and withdrawal action             | Submitted attempt awaiting adult review           |
| Completed            | Reviewer and approval date                               | Approved completion, shown below the active board |

Checklist progress and approved completion totals remain separate. Mentor screens prioritize review requests and teens who need help; parent screens show their linked teens’ progress and shared feedback.

## Permissions

All permissions below are restricted to an active church membership. “Linked” means an active relationship to that participant in the same church. Role labels change navigation; backend authorization enforces access.

| Capability                                       | Teen         | Parent                            | Mentor or reviewer       | Church coordinator             | Platform admin                     |
| ------------------------------------------------ | ------------ | --------------------------------- | ------------------------ | ------------------------------ | ---------------------------------- |
| Read enabled curriculum                          | Yes          | Yes                               | Yes                      | Yes                            | Manage shared catalog              |
| Update personal checklist and submit work        | Own attempts | No                                | No                       | No                             | No                                 |
| Read participant progress and shared feedback    | Own          | Linked teens                      | Assigned teens           | Church participants            | No routine access                  |
| Approve or request more practice                 | No           | Only with separate reviewer grant | Only with reviewer grant | Only with reviewer grant       | No                                 |
| Link parents and mentors or grant reviewer scope | No           | No                                | No                       | Within church                  | No routine action                  |
| Invite members and assign church roles           | No           | No                                | No                       | Within church                  | Bootstrap first coordinator        |
| Enable reviewed challenges                       | No           | No                                | No                       | Within church                  | Publish shared catalog             |
| Draft church-specific curriculum                 | No           | No                                | No                       | Within church, later milestone | Shared curriculum, later milestone |
| Revoke an erroneous approval                     | No           | No                                | No                       | Church, reason required        | No routine action                  |

Platform administrators maintain service configuration and the shared catalog. The platform plan adds scoped, audited, read-only support sessions and demo role previews. Any future support access to participant records must be deliberate, time-limited, and audited; it is not a default consequence of being an administrator. Role and relationship changes take effect on the next authorized request and remove access to past records too.

## Data model

| Record                   | Main fields and relationships                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| User                     | Auth identity ID, display name; authentication credentials belong to the auth service                                               |
| Church                   | ID, name, active status                                                                                                             |
| Membership               | Church ID, user ID, active status; multiple role grants per membership                                                              |
| Participant              | ID, church ID, optional teen membership ID for assisted profiles, display name; each participant belongs to one church in the pilot |
| Participant relationship | Church ID, participant ID, adult membership ID, parent or mentor relationship, active status                                        |
| Reviewer grant           | Church ID, participant ID, reviewer membership ID, challenge or reviewed group scope, active status                                 |
| Challenge                | Stable ID, URL slug, source owner; a church-owned challenge cannot be exposed to another church                                     |
| Challenge version        | Challenge ID, immutable published version ID, content, stable checklist item IDs, review criteria, publication status               |
| Church curriculum        | Church ID, enabled challenge version ID, church review date and reviewing coordinator                                               |
| Attempt                  | ID, church ID, participant ID, challenge version ID, state, revision number, timestamps                                             |
| Checklist entry          | Attempt ID, stable item ID, checked value, updated timestamp                                                                        |
| Review request           | Attempt ID, submitted revision and snapshot, reviewer ID, demonstration summary, submitted or withdrawn status                      |
| Review decision          | Request ID, reviewer membership ID, approve or more practice decision, feedback, date                                               |
| Completion               | Attempt ID, challenge version ID, approval decision ID, approval date, current validity                                             |
| Audit event              | Church ID where applicable, actor, action, subject ID, time, reason; append-only                                                    |

Store attempt states as active, submitted, approved, or archived. Derive readiness from required checklist entries and outstanding more-practice feedback. Keep recommendations outside the attempt state.

The existing index-based checklists must gain stable item IDs before sync. Assign an initial version to each reviewed challenge. Published versions are immutable; revised requirements produce a new version, and existing attempts continue against the version they started. Do not silently migrate approved work or reuse deleted item IDs. Allow only one non-archived attempt per participant and challenge in the pilot.

Published curriculum can start as repository-managed content. Import reviewed versions into the backend catalog; runtime attempts reference those IDs. A visual curriculum editor can follow later. Church annotations should remain separate from shared content, and requirement changes must create a new church-owned version.

## First backend milestone

The [platform plan](platform-architecture.md) now recommends Supabase and Cloudflare Workers; confirm hosting and account defaults before provisioning. The required capabilities are managed authentication, a relational database, server-enforced church and relationship permissions, transactional review decisions, and an audit trail. The public GitHub Pages site can remain static; authenticated writes require a backend. Privileged credentials never ship in browser bundles.

Implement the milestone in this order:

1. Introduce stable challenge and checklist IDs; publish the reviewed pilot curriculum versions.
2. Add invitation-based sign-in, church membership, participants, parent and mentor links, and explicit reviewer grants. No open church enrollment in the pilot.
3. Replace the browser progress adapter with authenticated reads and writes. Treat unsaved or offline changes explicitly; use attempt revisions to reject stale overwrites rather than silently losing another device’s changes.
4. Add explicit review requests, more-practice feedback, transactional approval, and approved completion records. A database transaction prevents duplicate approvals and verifies the submitted revision.
5. Add the coordinator’s member setup and review queue; show linked progress to parents. Produce printable records from approved completions.
6. Add an optional, previewed local-progress import. Imported checklists become unverified practice progress, never adult-approved completions. Account storage wins conflicts unless the user deliberately chooses an import; keep local prototype records until import is confirmed.

For the first release, use checklists and short shared demonstration summaries rather than uploads, private journals, direct messaging, payments, or apparel ordering. Persist parent relationships now even if the initial parent screen is simple. Church content editing, multiple church memberships, certificates, and level progression follow after the pilot validates the basic loop.

### Acceptance checks

- A teen’s checklist and approved record appear after sign-in on a second device.
- Requests for another church’s records fail at the backend, including direct ID requests.
- An unassigned adult cannot read a teen’s attempt; a parent without a reviewer grant cannot approve it.
- Revoking a relationship or reviewer grant removes access or approval rights immediately on the next request.
- Checklist readiness alone never increments approved completion totals.
- Duplicate submissions, stale revisions, and two reviewers acting together cannot produce conflicting or duplicate completions.
- Feedback and approval history survive curriculum updates; an existing attempt retains its original criteria.
- Completing all seven approved Foundation 7 challenges changes the prompt and leaves other approved curriculum accessible.
- Local imports cannot create approvals. Signed-out users cannot access participant records.
- Restore a database backup in a test environment before relying on the service for the live pilot.

## Pilot operation and decisions before live enrollment

The church names a coordinator, reviews curriculum, identifies qualified reviewers, and establishes how demonstrations happen in person. Parents receive a clear explanation of shared progress and feedback. Confirm the participant account and guardian authorization process before inviting minors; this specification does not set an age policy.

Before implementation, settle the account method for teens who do not have email, hosting and backend ownership, and who may designate reviewers. Proposed default: the coordinator owns reviewer grants, a designated reviewer approves work, and every review decision is shared with the teen and linked adults. Set a retention and participant-exit process before storing live records.

At the end of four weeks, examine where teens stalled, whether adults could judge the demonstrations, how often more practice was requested, and whether the workshop’s next step was clear. Proceed to wider curriculum and editing only when a teen and adult can complete the loop without developer assistance.
