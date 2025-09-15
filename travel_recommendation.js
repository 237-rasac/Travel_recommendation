document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const recommendationResults = document.createElement('div');
    recommendationResults.id = 'recommendationResults';

    // Append the new recommendationResults container to the hero-section
    const heroSection = document.querySelector('.hero-section');
    heroSection.appendChild(recommendationResults);

    const timeZoneMap = {
        'sydney, australia': 'Australia/Sydney',
        'melbourne, australia': 'Australia/Melbourne',
        'tokyo, japan': 'Asia/Tokyo',
        'kyoto, japan': 'Asia/Tokyo',
        'rio de janeiro, brazil': 'America/Sao_Paulo',
        'são paulo, brazil': 'America/Sao_Paulo',
        'brazil': 'America/Sao_Paulo',
        'japan': 'Asia/Tokyo',
        'australia': 'Australia/Sydney',
    };

    const fetchRecommendations = async () => {
        try {
            const response = await fetch('travel_recommendation.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data); // Task 6: Verify data is fetched
            return data;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return null;
        }
    };

    const displayResults = (results) => {
        recommendationResults.innerHTML = ''; // Clear previous results
        results.forEach(item => {
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            resultCard.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            recommendationResults.appendChild(resultCard);
        });
    };

    const performSearch = async () => {
        const query = searchInput.value.toLowerCase().trim();
        const data = await fetchRecommendations();

        if (!data || query === '') {
            return;
        }

        let results = [];
        let timeZone = null;

        if (query.includes('beach')) {
            results = data.beaches;
        } else if (query.includes('temple')) {
            results = data.temples;
        } else {
            // Search by country or city name
            data.countries.forEach(country => {
                if (country.name.toLowerCase().includes(query)) {
                    results = [...results, ...country.cities];
                    if (timeZoneMap[country.name.toLowerCase()]) {
                        timeZone = timeZoneMap[country.name.toLowerCase()];
                    }
                } else {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(query)) {
                            results.push(city);
                            if (timeZoneMap[city.name.toLowerCase()]) {
                                timeZone = timeZoneMap[city.name.toLowerCase()];
                            }
                        }
                    });
                }
            });
        }

        displayResults(results);

        // Display current time for the recommended country/city (Optional Task 10)
        if (timeZone) {
            const options = {
                timeZone: timeZone,
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };
            const currentTime = new Date().toLocaleTimeString('en-US', options);
            const timeElement = document.createElement('div');
            timeElement.className = 'time-display';
            timeElement.textContent = `Current time in ${query.charAt(0).toUpperCase() + query.slice(1)}: ${currentTime}`;
            recommendationResults.prepend(timeElement);
        }
    };

    const resetSearch = () => {
        recommendationResults.innerHTML = '';
        searchInput.value = '';
    };

    searchBtn.addEventListener('click', performSearch);
    clearBtn.addEventListener('click', resetSearch);
});