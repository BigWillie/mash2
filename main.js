const pingSound = new Audio('splat.mp3');

const app = Vue.createApp({
    data() {
        return {
            lifeChoices: {
                'home': [
                    { name: 'Mansion', crossedOff: false },
                    { name: 'Apartment', crossedOff: false },
                    { name: 'Shack', crossedOff: false },
                    { name: 'House', crossedOff: false },
                ],
                'wife': [
                    { name: 'Tina Fey', crossedOff: false },
                    { name: 'Oprah', crossedOff: false },
                    { name: 'Judi Dench', crossedOff: false },
                    { name: 'Mrs Fenneri', crossedOff: false },
                ],
                'kids': [
                    { name: '1', crossedOff: false },
                    { name: '2', crossedOff: false },
                    { name: '3', crossedOff: false },
                    { name: '1000', crossedOff: false },
                ],
                'Occupation': [
                    { name: 'Spy for England', crossedOff: false },
                    { name: 'Spy for Madagascar', crossedOff: false },
                    { name: 'Spy for Mcdonalds', crossedOff: false },
                    { name: 'Janitor', crossedOff: false },
                ],
                'Income': [
                    { name: '$1 million', crossedOff: false },
                    { name: '$100,000,000', crossedOff: false },
                    { name: '$10,000', crossedOff: false },
                    { name: '$.001', crossedOff: false },
                ],
                'Car': [
                    { name: 'QTrazn', crossedOff: false },
                    { name: 'Jalopy', crossedOff: false },
                    { name: 'Jeep', crossedOff: false },
                    { name: 'Hotwheels', crossedOff: false },
                ],
                'Place': [
                    { name: 'New York', crossedOff: false },
                    { name: 'Queens', crossedOff: false },
                    { name: 'Staten Island', crossedOff: false },
                    { name: 'Poop Town', crossedOff: false },
                ]
            },
            selectedCategories: [],
            lifePrediction: {},
            lifeCount: 0,
        };
    },
    computed: {
        categories() {
            const catKeys = Object.keys(this.lifeChoices);

            // Get the selected keys from this.selectedCategories
            const selectedKeys = this.selectedCategories.map(category => category.category);

            // Filter out the catKeys that are present in selectedKeys
            const filteredCatKeys = catKeys.filter(key => !selectedKeys.includes(key));

            return filteredCatKeys;
        },
        magicNumber() {
            // a random number greater than 3 and no greater than 10
            return Math.floor(Math.random() * 8) + 3;
        }
    },
    methods: {
        reset() {
            this.selectedCategories = [];
            this.lifePrediction = {};
            this.lifeCount = 0;
        },
        chooseCategory(category) {
            const categoryObj = {
                category,
                choices: JSON.parse(JSON.stringify(this.lifeChoices[category]))
            }
            this.selectedCategories.push(categoryObj)
        },
        playMash() {
            console.log("Playing MASH!");


            function skipCategory(currentCategory, totalCategories) {
                return (currentCategory + 1) % totalCategories;
              }
              
              function modulo(x, y) {
                var mod = x % y;
                if (mod < 0) {
                  mod += y;
                }
                return mod;
              }
              

          let mashGameData = this.selectedCategories.reduce( (acc, curr) => {
                acc[curr.category] = curr.choices.map( (x) => x.name );
                return acc;
            },{})
                
            let magicNumber = this.magicNumber

            
            let lifePrediction = {};
            let gameFinished = false;
            let gameCategories = Object.keys(mashGameData);
            let currentCategory = 0;
            let choiceIndex = 0;
            let stepCounter = magicNumber - 1;
          
            while (!gameFinished) {
              let categoryChoices = mashGameData[gameCategories[currentCategory]];
              let remainingChoices = categoryChoices.length - choiceIndex;
          
              if (stepCounter < remainingChoices) {
                choiceIndex += stepCounter;
                mashGameData[gameCategories[currentCategory]] = mashGameData[gameCategories[currentCategory]].filter(function (_, id) {
                  return id !== choiceIndex;
                });
          
                if (mashGameData[gameCategories[currentCategory]].length === 1) {
                  lifePrediction[gameCategories[currentCategory]] = mashGameData[gameCategories[currentCategory]][0];
          
                  mashGameData = Object.keys(mashGameData).filter(function (key) {
                    return key !== gameCategories[currentCategory];
                  }).reduce(function (acc, key) {
                    acc[key] = mashGameData[key];
                    return acc;
                  }, {});
          
                  gameCategories.splice(currentCategory, 1);
          
                  if (gameCategories.length !== 0) {
                    choiceIndex = 0;
                    currentCategory = modulo(currentCategory, gameCategories.length);
                  }
                }
          
                stepCounter = magicNumber - 1;
              } else {
                stepCounter -= remainingChoices;
                currentCategory = skipCategory(currentCategory, gameCategories.length);
                choiceIndex = 0;
              }
          
              gameFinished = Object.keys(mashGameData).length === 0;
            }

            this.lifePrediction = lifePrediction;

            console.log(JSON.stringify(this.selectedCategories))

            const delay = 500; // 1/2-second delay
     
            for (let i = 0; i < this.selectedCategories.length; i++) {
                const category = this.selectedCategories[i];
                const choice = lifePrediction[category.category];
            
                for (let j = 0; j < category.choices.length; j++) {
                    const choiceObj = category.choices[j];
            
                    if (choiceObj.name !== choice) {
                        setTimeout(() => {
                            choiceObj.crossedOff = true;
                            pingSound.cloneNode().play();
                            this.lifeCount++
                           
                        }, delay * (i * category.choices.length + j));
                    }
                }
            
             
            }


        
          }
          

    }
});

app.mount('#app');



