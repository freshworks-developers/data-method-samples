document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
};

async function renderApp() {
  let _client = await app.initialized();
  window['client'] = _client;
  client.events.on('app.activated', renderSidebar);
  return;
}

function renderSidebar() {
  const dataMethBtn = document.querySelector('.btn-ticket-details');
  const space = document.querySelector('.space');
  dataMethBtn.addEventListener('fwClick', function getTktDetails() {
    /** ~ playground start of ticket details page ~ */

    // ticket
    client.data
      .get('ticket')
      .then(function getDetails({ ticket: { description: desc, priority: priority } }) {
        space.insertAdjacentHTML(
          'afterbegin',
          `<li><i>"ticket"</i> priority: <mark>${priority}</mark> : desc: <mark>${desc}</mark></li>`
        );
      })
      .catch(console.error);

    //requester
    client.data
      .get('requester')
      .then(function getDetails({ requester: { name: name, email: email } }) {
        space.insertAdjacentHTML(
          'afterbegin',
          `<li><i>"contact"</i> email: <mark>${email}</mark> name: <mark>${name}</mark></li>`
        );
      })
      .catch(console.error);
    /** ~  end ~ */
  });
}
