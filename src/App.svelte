<script lang="ts">
  import countries from './countries.json';

  const maxStoredGuesses = 5;

  let currentCountry = countries[0];
  let currentGuess = '';

  let settingsSpan: HTMLSpanElement;
  let settingsMenu: HTMLDivElement;
  let settingsMenuExpanded = false;

  let settings: {
    saveGuesses: boolean,
    allowHints: boolean,
    continents: {
      Africa: boolean,
      Asia: boolean,
      Europe: boolean,
      Americas: boolean,
      Oceania: boolean
    }
  }

  let lastGuess : {
    correct: boolean,
    country: string,
    countryCode: string,
    guess: string
  } | undefined = undefined;

  LoadGuesses();
  LoadSettings();
  NextCountry();

  // Make a guess for the current flag
  function MakeGuess(e: Event) {
    e.preventDefault();

    if (currentGuess.toLowerCase() === currentCountry.name.toLowerCase()) {
      SaveGuess(true);
    } else {
      SaveGuess(false);
    }

    NextCountry();
  }

  // Pick a random country and reset the guess
  function NextCountry() {
    let validCountries = countries.filter(c => settings.continents.Africa && c.region === 'Africa' ||
      settings.continents.Asia && c.region === 'Asia' ||
      settings.continents.Europe && c.region === 'Europe' ||
      settings.continents.Americas && c.region === 'Americas' ||
      settings.continents.Oceania && c.region === 'Oceania');

    let randomIndex = Math.floor(Math.random() * validCountries.length);
    currentCountry = validCountries[randomIndex];
    currentGuess = '';
  };

  function SaveGuess(correct: boolean) {
    currentCountry.previousGuesses.push(correct);
    if (currentCountry.previousGuesses.length > maxStoredGuesses) {
      currentCountry.previousGuesses.shift();
    }

    lastGuess = {
      correct: correct,
      country: currentCountry.name,
      countryCode: currentCountry.code,
      guess: currentGuess
    };

    if (settings.saveGuesses) {
      localStorage.setItem(currentCountry.code, JSON.stringify(currentCountry.previousGuesses));
    }
  }

  function LoadGuesses() {
    countries.forEach((country) => {
      let storedGuesses = localStorage.getItem(country.code);
      if (storedGuesses) {
        country.previousGuesses = JSON.parse(storedGuesses);
      }
    });
  }

  function ToggleSettings() {
    SpinSettingsGear();

    if (settingsMenu.classList.contains('expand')){ // Close menu

      // Check if at least one continent is selected
      if (!settings.continents.Africa && !settings.continents.Asia && !settings.continents.Europe && !settings.continents.Americas && !settings.continents.Oceania) {
        alert('You must select at least one continent to play the game.')
        return;
      }

      settingsMenu.classList.remove('expand');
      setTimeout(() => { settingsMenu.classList.add('collapse'); }, 1);
      settingsMenuExpanded = false;
      SaveSettings();
      NextCountry();

      settingsMenu.style.overflowY = 'hidden';
    } else { // Open menu
      settingsMenu.classList.remove('collapse');
      setTimeout(() => { settingsMenu.classList.add('expand'); }, 1);
      settingsMenuExpanded = true;

      setTimeout(() => { settingsMenu.style.overflowY = 'auto' }, 500);
    }
  }

  function SpinSettingsGear() {
    settingsSpan.classList.remove('spin');
    setTimeout(() => { settingsSpan.classList.add('spin'); }, 1);
  }

  function LoadSettings() {
    let storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      settings = JSON.parse(storedSettings);
    } else {
      settings = {
        saveGuesses: true,
        allowHints: true,
        continents: {
          Africa: true,
          Asia: true,
          Europe: true,
          Americas: true,
          Oceania: true
        }
      }
    }
  }

  function SaveSettings() {
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  function DeleteLocalStorage() {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete all data? This will delete all your previous guesses, which are used to track your progress and show flags you struggle with more often. This can not be undone.')) {
      return;
    }

    localStorage.clear();
    localStorage.setItem('settings', JSON.stringify(settings));
    LoadGuesses();
  }
</script>

<main>
  {#if settingsMenuExpanded}
   <!-- svelte-ignore a11y-click-events-have-key-events -->
   <!-- svelte-ignore a11y-no-static-element-interactions -->
   <div style="z-index: 0; position: absolute; height: 100vh; width: 100vw; background-color: transparent" on:click={ToggleSettings}></div>
  {/if}

  <div id="header">
    <div id="settingscontainer">
      <button id="settingsgearcontainer" on:click={ToggleSettings}>
        <span>
          <i id="settingsgear" class="bi bi-gear" bind:this={settingsSpan}></i>
        </span>
      </button>
      <div id="settingsmenu" bind:this={settingsMenu} style="height: 0px; padding: 0 0; border: 0">
        <h1>Settings</h1>
        <div class="settingsitem">
          <label class="checkboxcontainer">
            <input bind:checked={settings.saveGuesses} type="checkbox" />
            Save your guesses
          </label>
        </div>
        <div class="settingsitem">
          <label class="checkboxcontainer">
            <input bind:checked={settings.allowHints} type="checkbox" />
            Allow hints
          </label>
        </div>
        <br/>
        <div class="settingsitem">
          <h2>Continents</h2>
          <label class="checkboxcontainer">
            <input bind:checked={settings.continents.Americas} type="checkbox" />
            Americas ({countries.filter(c => c.region === 'Americas').length} countries)
          </label>
          <label class="checkboxcontainer">
            <input bind:checked={settings.continents.Africa} type="checkbox" />
            Africa ({countries.filter(c => c.region === 'Africa').length} countries)
          </label>
          <label class="checkboxcontainer">
            <input bind:checked={settings.continents.Asia} type="checkbox" />
            Asia ({countries.filter(c => c.region === 'Asia').length} countries)
          </label>
          <label class="checkboxcontainer">
            <input bind:checked={settings.continents.Europe} type="checkbox" />
            Europe ({countries.filter(c => c.region === 'Europe').length} countries)
          </label>
          <label class="checkboxcontainer">
            <input bind:checked={settings.continents.Oceania} type="checkbox" />
            Oceania ({countries.filter(c => c.region === 'Oceania').length} countries)
          </label>
        </div>
        <br/>
        <div class="settingsitem">
          <button class="danger" on:click={DeleteLocalStorage}>Delete all data</button>
        </div>
      </div>
    </div>

  </div>

  <div id="gamediv">
    <figure class="big">
      <img class="flag" src={`Flags/${currentCountry.code.toLowerCase()}.svg`} alt="unknown flag"/>
    </figure>
    <br/>
    <br/>
    <form on:submit={MakeGuess}>
      <input style="margin-bottom: 1vh;" type="text" bind:value={currentGuess} placeholder="Your guess..." />
      <button>Make guess</button>
    </form>
    <span>
      {#if lastGuess}

        <!-- If the guess was correct -->
        {#if lastGuess.correct}
          <h2 class="response correct">Correct! That was <b>{lastGuess.country}</b>.</h2>

        <!-- If the guess was incorrect, but another country -->
        {:else if !lastGuess.correct && countries.find(c => c.name.toLowerCase() === lastGuess?.guess.toLowerCase())}
          <h2 class="response incorrect">Incorrect! That was <b>{lastGuess.country}</b>. You guessed <b>{lastGuess.guess}</b>.</h2>
          <div class="resultdivider">
            <div class="resultitem">
              <h2 class="response correct">Correct country:</h2>
              <h3 class="response correct">{lastGuess.country}</h3>
              <figure class="mid">
                <img class="flag" src={`Flags/${lastGuess.countryCode.toLowerCase()}.svg`} alt="flag"/>
              </figure>
            </div>
            <div class="resultitem">
              <h2 class="response incorrect">Your guess:</h2>
              <h3 class="response incorrect">{lastGuess.guess}</h3>
              <figure class="mid">
                <img class="flag" src={`Flags/${countries.find(c => c.name.toLowerCase() === lastGuess?.guess.toLowerCase())?.code}.svg`} alt="flag"/>
              </figure>
            </div>
          </div>

        <!-- If the guess was incorrect, and not another country -->
        {:else}  
          <h2 class="response incorrect">Incorrect! That was <b>{lastGuess.country}</b>.</h2>
          <h3 class="response incorrect">Your guess was <b>{lastGuess.guess}</b>, which is not the correct name for any country.</h3>
        {/if}
      {/if}
    </span>
  </div>
</main>