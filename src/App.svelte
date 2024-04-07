<script lang="ts">
  import countries from './countries.json';

  const maxStoredGuesses = 5;

  let currentCountry = countries[0];
  let currentGuess = '';

  let lastGuess : {
    correct: boolean,
    country: string,
    countryCode: string,
    guess: string
  } | undefined = undefined;

  LoadGuesses();
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
    let randomIndex = Math.floor(Math.random() * (countries.length - 1) + 1);
    currentCountry = countries[randomIndex];
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

    localStorage.setItem(currentCountry.code, JSON.stringify(currentCountry.previousGuesses));
  }

  function LoadGuesses() {
    countries.forEach((country) => {
      let storedGuesses = localStorage.getItem(country.code);
      if (storedGuesses) {
        country.previousGuesses = JSON.parse(storedGuesses);
      }
    });
  }

  function OpenSettings() {
    SpinSettingsGear();
  }

  function SpinSettingsGear() {
    let settingsSpan = document.getElementById('settingsgear') as HTMLElement;
    settingsSpan.classList.add('spin');
    setTimeout(() => { settingsSpan.classList.remove('spin'); }, 1000);
  }
</script>

<main>
  <div id="header">
    <div id="settingscontainer">
      <button id="settingsgearcontainer" on:click={OpenSettings}>
        <span>
          <i id="settingsgear" class="bi bi-gear"></i>
        </span>
      </button>
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


<style scoped>
  #gamediv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#header {
  display: flex;
  justify-content: flex-end;
}

#settingsgear {
  font-size: 4em;
  display: flex;
}

#settingscontainer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  align-items: flex-end;
  margin: 1%;
}

.correct {
  color: green;
}

.incorrect {
  color: red;
}

.response {
  font-weight: 400;
}

.resultdivider {
  display: flex;
  flex-direction: row;
  width: 100vw;
  justify-content: center;
}

.resultitem {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1%;
}
</style>