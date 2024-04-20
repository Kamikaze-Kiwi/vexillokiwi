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

    countries = countries.sort((a, b) => {
      let aCorrect = a.previousGuesses.filter((guess) => guess).length;
      let bCorrect = b.previousGuesses.filter((guess) => guess).length;

      return bCorrect - aCorrect;
    });

    function CountriesWhereCorrect(amount: number) {
      return countries.filter((country) => country.previousGuesses.filter((guess) => guess).length === amount);
    }
</script>

<main>
    <h1>{CountriesWhereCorrect(5).length} / {countries.length} perfected countries (last 5 guesses correct)!</h1>

    <h2>The number shows how many guesses ago this was made. For example; 1 is the latest guess while 5 is 5 guesses ago.</h2>
    <h3>A ❔ means that there is no recorded guess.</h3>
    <a href="/">Back to the game</a>

    <table>
        <thead>
            <tr>
                <th>Country</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
            </tr>
        </thead>
        <tbody>
            {#each countries as country}
            <tr>
                <td>{country.name}</td>
                {#each {length: 5} as _, index}
                  {#if country.previousGuesses[index] === true}
                    <td>✅</td>
                  {:else if country.previousGuesses[index] === false}
                    <td>❌</td>
                  {:else}
                    <td>❔</td>
                  {/if}
                {/each}
            </tr>
            {/each}
        </tbody>
      </table>
</main>

<style scoped>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    table {
        border-collapse: collapse;
        width: 90vw;
    }

    th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: center;
    }

    th {
      background-color: #121212;
    }

    tr:nth-child(even) {
      background-color: #1a1a1a;
    }
</style>