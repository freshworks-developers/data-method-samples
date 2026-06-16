/* Shared fetch + render helpers for client.data.get() playground */
window.HealthFirstDataPlayground = (function () {
  const DATA_CATALOG = [
    {
      id: 'account',
      label: 'Account',
      intro: 'Available on most placeholders — no REST calls.',
      keys: [
        { key: 'currentHost', label: 'currentHost' },
        { key: 'loggedInUser', label: 'loggedInUser' },
        { key: 'domainName', label: 'domainName' }
      ]
    },
    {
      id: 'ticket',
      label: 'Ticket page',
      intro: 'Freshdesk / Freshservice ticket detail placeholders.',
      keys: [
        { key: 'ticket', label: 'ticket' },
        { key: 'contact', label: 'contact' },
        { key: 'requester', label: 'requester' },
        { key: 'company', label: 'company' },
        { key: 'group', label: 'group' },
        { key: 'email_config', label: 'email_config' },
        { key: 'time_entry', label: 'time_entry' }
      ]
    },
    {
      id: 'options',
      label: 'Field options',
      intro: 'Dropdown values already loaded on the ticket page.',
      keys: [
        { key: 'priority_options', label: 'priority_options' },
        { key: 'ticket_type_options', label: 'ticket_type_options' },
        { key: 'customfield_options', label: 'customfield_options' },
        { key: 'status_options', label: 'status_options' }
      ]
    },
    {
      id: 'portal',
      label: 'Portal',
      intro: 'End-user / support portal context.',
      keys: [
        { key: 'portal', label: 'portal' },
        { key: 'user', label: 'user' }
      ]
    },
    {
      id: 'freshservice',
      label: 'Freshservice',
      intro: 'ITSM objects on change, asset, user, and ticket pages.',
      keys: [
        { key: 'change', label: 'change' },
        { key: 'asset', label: 'asset' },
        { key: 'department', label: 'department' },
        { key: 'associatedProblem', label: 'associatedProblem' }
      ]
    },
    {
      id: 'crm',
      label: 'CRM',
      intro:
        'Freshworks CRM entity context — open from a deal page (deal_entity_menu). On Freshdesk ticket sidebar, currentEntityInfo will error by design.',
      keys: [{ key: 'currentEntityInfo', label: 'currentEntityInfo' }]
    }
  ];

  function formatJson(value) {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  function formatError(error) {
    if (!error) {
      return 'Unknown error';
    }
    if (typeof error === 'string') {
      return error;
    }
    return error.message || formatJson(error);
  }

  function fetchDataKey(client, key) {
    return client.data.get(key);
  }

  function renderResult(container, key, payload, error) {
    container.hidden = false;
    container.innerHTML = '';

    const label = document.createElement('span');
    label.className = 'hf-result__label';
    label.textContent = error ? `Error — ${key}` : `Result — ${key}`;
    container.appendChild(label);

    const pre = document.createElement('pre');
    pre.className = 'hf-result' + (error ? ' hf-result--error' : '');
    pre.textContent = error ? formatError(error) : formatJson(payload);
    container.appendChild(pre);
  }

  function clearResult(container) {
    container.hidden = true;
    container.innerHTML = '';
  }

  function buildKeyButton(entry, client, resultEl, activeKeyEl) {
    const button = document.createElement('fw-button');
    button.setAttribute('color', 'secondary');
    button.setAttribute('size', 'small');
    button.textContent = entry.label;
    button.dataset.dataKey = entry.key;

    button.addEventListener('fwClick', async () => {
      activeKeyEl.innerHTML = 'Fetching <code>' + entry.key + '</code>…';
      try {
        const payload = await fetchDataKey(client, entry.key);
        activeKeyEl.innerHTML = 'Showing <code>' + entry.key + '</code>';
        renderResult(resultEl, entry.key, payload);
      } catch (error) {
        activeKeyEl.innerHTML = 'Failed <code>' + entry.key + '</code>';
        renderResult(resultEl, entry.key, null, error);
      }
    });

    return button;
  }

  function buildTabs(client, tabsRoot, resultEl, activeKeyEl) {
    tabsRoot.innerHTML = '';
    tabsRoot.setAttribute('active-tab-name', DATA_CATALOG[0].id);

    DATA_CATALOG.forEach((section, index) => {
      const tab = document.createElement('fw-tab');
      tab.setAttribute('slot', 'tab');
      tab.setAttribute('panel', section.id);
      tab.setAttribute('name', section.label);
      if (index === 0) {
        tab.setAttribute('active', '');
      }
      tabsRoot.appendChild(tab);

      const panel = document.createElement('fw-tab-panel');
      panel.setAttribute('name', section.id);

      const intro = document.createElement('p');
      intro.className = 'hf-panel-intro';
      intro.textContent = section.intro;
      panel.appendChild(intro);

      const grid = document.createElement('div');
      grid.className = 'hf-key-grid';
      section.keys.forEach((entry) => {
        grid.appendChild(buildKeyButton(entry, client, resultEl, activeKeyEl));
      });
      panel.appendChild(grid);

      tabsRoot.appendChild(panel);
    });
  }

  async function loadSurfaceMeta(client, metaEl) {
    if (!metaEl) {
      return;
    }
    try {
      const { currentHost } = await fetchDataKey(client, 'currentHost');
      const modules = currentHost?.subscribed_modules || [];
      metaEl.textContent = modules.length
        ? 'Subscribed modules: ' + modules.join(', ')
        : 'Data method playground';
    } catch {
      metaEl.textContent = 'Data method playground';
    }
  }

  function resolveOption(options, key, fallback) {
    return (options && options[key]) || fallback;
  }

  function getPlaygroundElements(options) {
    const opts = options || {};
    const tabsRoot = document.getElementById(resolveOption(opts, 'tabsId', 'data-tabs'));
    const resultEl = document.getElementById(resolveOption(opts, 'resultId', 'data-result'));
    const activeKeyEl = document.getElementById(resolveOption(opts, 'activeKeyId', 'active-key'));
    const metaEl = document.getElementById(resolveOption(opts, 'metaId', 'surface-meta'));

    if (!tabsRoot || !resultEl || !activeKeyEl) {
      throw new Error('Playground markup is missing required elements.');
    }

    return { tabsRoot, resultEl, activeKeyEl, metaEl };
  }

  async function init(client, options) {
    const opts = options || {};
    const { tabsRoot, resultEl, activeKeyEl, metaEl } = getPlaygroundElements(opts);

    buildTabs(client, tabsRoot, resultEl, activeKeyEl);
    clearResult(resultEl);
    activeKeyEl.textContent = 'Select a data key to fetch page context.';
    await loadSurfaceMeta(client, metaEl);
  }

  return {
    DATA_CATALOG,
    fetchDataKey,
    renderResult,
    formatJson,
    init
  };
})();
