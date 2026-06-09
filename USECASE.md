# Use Cases — HealthFirst Clinics (Data Method Sample)

**Sample repo:** [freshworks-developers/data-method-samples](https://github.com/freshworks-developers/data-method-samples)  
**Features demonstrated:** `client.data.get()` across Freshdesk, Freshservice, CRM, and portal placeholders — no REST calls

## Company Overview

**HealthFirst Clinics** is a healthcare support operation using **Freshdesk** for patient inquiries, **Freshservice** for internal IT, and **Freshworks CRM** for referral partnerships. Agents need page context in sidebars **without** extra API calls that slow load times or burn rate limits.

## Use Case Scenarios

### 1. Ticket Triage Sidebar Without REST Latency

**Scenario**: Nurses open 80+ tickets per shift. Each sidebar load cannot trigger separate Freshdesk API calls for priority, description, requester, and company.

**Use Case**: On `app.activated`, the playground calls `client.data.get('ticket')`, `get('requester')`, `get('company')`, and related keys. Data is already on the page; clicking **ticket** renders priority and description JSON instantly.

**Platform tie-in:** [Data method](https://developers.freshworks.com/docs/app-sdk/v3.0/common/client/data-method/) — promise-based, placeholder-specific availability.

---

### 2. Dropdown Options from Page Context

**Scenario**: Agents must pick valid priority and custom field values without a round-trip to the Fields API.

**Use Case**: `client.data.get('priority_options')`, `get('ticket_type_options')`, `get('customfield_options')`, and `get('status_options')` expose configured dropdown values already loaded on the ticket page.

**Platform tie-in:** Freshdesk ticket placeholders — `<field>_options` pattern.

---

### 3. SLA and Timer Awareness

**Scenario**: Supervisors enforce time-on-ticket policies before agents reply.

**Use Case**: `client.data.get('time_entry')` exposes timer state from the current page. Combined with `status_options`, the app can highlight allowed transitions without fetching ticket history via API.

---

### 4. Email Channel Configuration

**Scenario**: Agents reply from multiple support mailboxes; wrong `replyEmail` risks mis-routed patient threads.

**Use Case**: `client.data.get('email_config')` reads the active mailbox on the ticket page so the sidebar shows which address will send the reply.

---

### 5. Portal End-User Context

**Scenario**: HealthFirst exposes a patient portal for ticket submission; portal apps need tenant and user context without server calls.

**Use Case**: On `support_portal` placeholders, `client.data.get('portal')` and `get('user')` return portal configuration and the signed-in end user. `currentHost` lists subscribed SKUs for feature gating.

---

### 6. Freshservice ITSM Objects

**Scenario**: IT staff work changes, assets, and departments alongside incidents.

**Use Case**: `client.data.get('change')` on change pages, `get('asset')` on asset pages, `get('department')` on service user pages, and `get('associatedProblem')` on linked incidents — all from page context.

---

### 7. CRM Deal Context

**Scenario**: Partnership managers open deals in Freshworks CRM and need entity type/id for integrations.

**Use Case**: `client.data.get('currentEntityInfo')` on `deal_entity_menu` returns `currentEntityId` and `currentEntityType` for the open record.

---

### 8. CTI and Full-Page Agent Identity

**Scenario**: Phone agents work from the CTI bar or Apps menu and need profile + domain for audit logs.

**Use Case**: `client.data.get('loggedInUser')` and `get('domainName')` on `common` placeholders drive “logged in as …” banners and tenant-scoped links.

---

## Mapping to Sample Code

| Data key | Sample file | UI surface |
|----------|-------------|------------|
| `currentHost`, `loggedInUser`, `domainName` | `app/scripts/lib/data-playground.js` | All placeholders (Account tab) |
| `ticket`, `contact`, `requester`, `company`, `group`, `email_config`, `time_entry` | `app/scripts/lib/data-playground.js` | Ticket / contact sidebars (Ticket tab) |
| `priority_options`, `ticket_type_options`, `customfield_options`, `status_options` | `app/scripts/lib/data-playground.js` | Ticket sidebars (Field options tab) |
| `portal`, `user` | `app/scripts/lib/data-playground.js` | Portal tab (live fetch on `visitor-app` deployments; module declared as `support_portal: {}`) |
| `change`, `asset`, `department`, `associatedProblem` | `app/scripts/lib/data-playground.js` | Freshservice sidebars (Freshservice tab) |
| `currentEntityInfo` | `app/scripts/lib/data-playground.js` | CRM `deal` menu (CRM tab) |

**Entry points:** `app/views/playground.html` · `app/scripts/playground.js` · `manifest.json` module map
