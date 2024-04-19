<script lang="ts">
    import countriesJson from '../countries.json';
    import type { CountryType } from '../country';

    let countries = countriesJson as CountryType[];

    LoadGuesses();

    function LoadGuesses() {
      countries.forEach((country) => {
        let storedGuesses = localStorage.getItem(country.code);
        if (storedGuesses) {
          country.previousGuesses = JSON.parse(storedGuesses);
        }
      });
    }

    function CountriesWhereCorrect(amount: number) {
      return countries.filter((country) => country.previousGuesses.filter((guess) => guess).length === amount);
    }
</script>

<main>
    <h1>{CountriesWhereCorrect(5).length} / {countries.length} perfected countries (last 5 guesses correct)!</h1>
</main>