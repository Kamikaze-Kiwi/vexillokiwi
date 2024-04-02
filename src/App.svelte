<script lang="ts">
  import countries from './countries.json';

  const maxStoredGuesses = 5;

  let currentCountry = countries[0];
  let currentGuess = '';

  NextCountry();

  // Make a guess for the current flag
  function MakeGuess(e: Event) {
    e.preventDefault();

    if (currentGuess.toLowerCase() === currentCountry.name.toLowerCase()) {
      alert('Correct!');
      SaveGuess(true);
    } else {
      alert('Incorrect!');
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

    localStorage.setItem('guess', currentGuess);
  }
</script>

<main>
  <img src={`Flags/${currentCountry.code.toLowerCase()}.svg`} alt="flag" height="400"/>
  <br/>
  <br/>
  <form on:submit={MakeGuess}>
    <input type="text" bind:value={currentGuess} placeholder="Your guess..." />
    <button>Make guess</button>
  </form>
</main>

<style>

</style>
