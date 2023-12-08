
      //Set to client ID and API key from the Developer Console
      const CLIENT_ID = '729726050172-7g9kd93gbnicpssog06ragfljthslb82.apps.googleusercontent.com';
      const API_KEY = 'AIzaSyDqOE3IuyelUeCJsIbl-aSq7Yjx4hFz-cA';

      // Discovery doc URL for APIs used by the quickstart
      const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

      let tokenClient;
      let gapiInited = false;
      let gisInited = false;

      document.getElementById('authorize_button').style.visibility = 'hidden';
      document.getElementById('signout_button').style.visibility = 'hidden';

      /**
       * Callback after api.js is loaded.
       */
      function gapiLoaded() {
        gapi.load('client', initializeGapiClient);
      }

      /**
       * Callback after the API client is loaded. Loads the
       * discovery doc to initialize the API.
       */
      async function initializeGapiClient() {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
      }

      /**
       * Callback after Google Identity Services are loaded.
       */
      function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        gisInited = true;
        maybeEnableButtons();
      }

      /**
       * Enables user interaction after all libraries are loaded.
       */
      function maybeEnableButtons() {
        if (gapiInited && gisInited) {
          document.getElementById('authorize_button').style.visibility = 'visible';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick() {
       listMajors();
      }
      
      /**
       * sample spreadsheet:
       * https://docs.google.com/spreadsheets/d/15-10wROEXcBeWaUeCIkIh2oCIFtGbjmhZb0CLXP8XL0/edit#gid=0
       */
      async function listMajors() {

        let response;
        try {
          // Fetch
          response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '15-10wROEXcBeWaUeCIkIh2oCIFtGbjmhZb0CLXP8XL0',
            range: 'Headline info!A2:E',
          });
        } catch (err) {
          document.getElementById('content').innerText = err.message;
          return;
        }
        const range = response.result;
        if (!range || !range.values || range.values.length == 0) {
          document.getElementById('content').innerText = 'No values found.';
          return;
        }

        // Get the result as HTML and set it as the innerHTML of an existing element
        const headlinesArr = range.values;
        let text = "";
        headlinesArr.forEach(myFunction);

        document.getElementById("marqueetext").innerHTML = text;
        
        function myFunction(item, index) {
            text += item + " &emsp; "; 
        }

      }