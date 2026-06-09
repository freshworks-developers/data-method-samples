# HealthFirst Data Playground

Explore **`client.data.get()`** on Freshdesk, Freshservice, CRM, and portal pages — without REST calls. HealthFirst Clinics uses this sample to teach agents and developers which page-context keys are available on each placeholder.

**Platform:** 3.0 · **FDK:** 10.1.2 · **Node:** 24.11.0 · **UI:** Crayons v4

---

## Why one app, many surfaces

Data methods return objects already loaded on the page. HealthFirst maps the same playground UI to every supported placeholder so you can click a key, inspect JSON, and learn what works where — instead of guessing from docs alone.

| Surface | Module | Typical keys |
|---------|--------|--------------|
| **Ticket sidebar** | `support_ticket`, `service_ticket` | `ticket`, `requester`, `priority_options`, `time_entry`, … |
| **Contact sidebar** | `support_contact` | `contact`, `company`, … |
| **Portal sidebar** | `support_portal` (module declared; end-user UI needs `visitor-app` — see note below) | `portal`, `user`, `currentHost` |
| **Change sidebar** | `service_change` | `change`, `currentHost` |
| **Asset sidebar** | `service_asset` | `asset`, `currentHost` |
| **User sidebar** | `service_user` | `department`, `currentHost` |
| **Deal menu** | `deal` | `currentEntityInfo` |
| **Apps menu / CTI bar** | `common` | `loggedInUser`, `domainName`, `currentHost` |

Keys not available on the current page return an error in the result panel — that is expected when exploring from the wrong placeholder.

---

## Features

### Tabbed data key browser

- **Account** — `currentHost`, `loggedInUser`, `domainName`
- **Ticket page** — `ticket`, `contact`, `requester`, `company`, `group`, `email_config`, `time_entry`
- **Field options** — `priority_options`, `ticket_type_options`, `customfield_options`, `status_options`
- **Portal** — `portal`, `user`
- **Freshservice** — `change`, `asset`, `department`, `associatedProblem`
- **CRM** — `currentEntityInfo`

Each button calls `client.data.get(key)` and pretty-prints the JSON response.

### Shared library

`app/scripts/lib/data-playground.js` builds tabs, wires buttons, and renders results. Entry script: `app/scripts/playground.js`.

---

## Setup

```sh
git clone https://github.com/freshworks-developers/data-method-samples.git
cd data-method-samples
fdk run
```

Open your Freshworks product with `?dev=true`, install the custom app, and open **HealthFirst Data Playground** from the relevant sidebar, Apps menu, or CTI bar.

---

## Project layout

```
data-method-samples/
├── manifest.json
├── config/iparams.json
├── app/
│   ├── views/playground.html
│   ├── scripts/
│   │   ├── playground.js
│   │   └── lib/data-playground.js
│   └── styles/
│       ├── common.css
│       ├── playground.css
│       └── images/icon.svg
├── README.md
└── USECASE.md
```

---

## Tech stack

- **Platform:** Freshworks Platform 3.0
- **Runtime:** Node.js 24.11.0 · FDK 10.1.2
- **UI:** Crayons v4

---

## Resources

- [Data method](https://developers.freshworks.com/docs/app-sdk/v3.0/common/client/data-method/)
- [Modular apps](https://developers.freshworks.com/docs/app-sdk/v3.0/common/modular-apps/)
- [USECASE.md](./USECASE.md)

### Portal module note

FDK 10.x allows either an **`app/`** folder (agent surfaces) or a **`visitor-app/`** folder (end-user portal), not both in one package. This sample uses **`app/`** for all agent placeholders and declares **`support_portal: {}`** so multi-SKU installs include the portal module. The playground still exposes **`portal`** and **`user`** keys for learning; to run on a live portal page, adapt the same playground into a **`visitor-app/`** layout (see `end-user-app-samples/conditional-fields`).
