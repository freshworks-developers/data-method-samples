Use Cases - HealthFirst Clinics / Data Method Samples
======================================================

Company Overview
----------------

**HealthFirst Clinics** is a healthcare support operation using **Freshdesk** for patient inquiries, **Freshservice** for internal IT, and **Freshworks CRM** for referral partnerships. Agents need page context in sidebars without extra API calls that slow load times or burn rate limits.

* * * * *

Use Case Scenarios
------------------

### 1\. Ticket Triage Sidebar Without REST Latency

**Scenario**: Nurses open 80+ tickets per shift. Each sidebar load cannot trigger separate Freshdesk API calls for priority, description, requester, and company.

**Use Case**: The playground calls `client.data.get('ticket')`, `get('requester')`, and `get('company')`. Data is already on the page; clicking **ticket** renders priority and description JSON instantly with no network round trip.

* * * * *

### 2\. Dropdown Options from Page Context

**Scenario**: Agents must pick valid priority and custom field values without calling the Fields API on every ticket open.

**Use Case**: `client.data.get('priority_options')`, `get('ticket_type_options')`, `get('customfield_options')`, and `get('status_options')` expose configured dropdown values already loaded on the ticket page.

* * * * *

### 3\. SLA and Timer Awareness

**Scenario**: Supervisors enforce time-on-ticket policies before agents reply to patient threads.

**Use Case**: `client.data.get('time_entry')` exposes timer state from the current page. Combined with `status_options`, the sidebar can highlight allowed transitions without fetching ticket history via REST.

* * * * *

### 4\. Freshservice ITSM Object Context

**Scenario**: IT staff work changes, assets, and departments alongside incidents on Freshservice.

**Use Case**: `client.data.get('change')` on change pages, `get('asset')` on asset pages, and `get('department')` on service user pages return object context from the active page — the same playground UI teaches which keys work on each placeholder.

* * * * *

### 5\. CRM Deal and Agent Identity

**Scenario**: Partnership managers open CRM deals and phone agents work from the CTI bar; both need entity and profile context for audit logs and integrations.

**Use Case**: `client.data.get('currentEntityInfo')` on the deal menu returns entity type and ID. `get('loggedInUser')` and `get('domainName')` on common placeholders drive tenant-scoped banners and links.
