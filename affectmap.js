
        // Location data with coordinates
        const locationData = {
            'estancia': {
                name: 'Estancia, Iloilo',
                coords: [11.455, 123.15],
                entries: [
                    {term: 'kalipay', category: 'happy'},
                    {term: 'kasakit', category: 'pain'},
                    {term: 'kasubo', category: 'sadness'},
                    {term: 'palamuypoy', category: 'weakness'},
                    {term: 'dugo', category: 'blood'}
                ]
            },
            'passi': {
                name: 'Passi City, Iloilo',
                coords: [11.107, 122.633],
                entries: [
                    {term: '[broken heart]', category: 'sadness'},
                    {term: 'proud feminine', category: 'happy,dalaga'}
                ]
            },
            'guimaras': {
                name: 'Guimaras',
                coords: [10.567, 122.583],
                entries: [
                    {term: 'dalaga na', category: 'dalaga'},
                    {term: 'headache', category: 'pain'}
                ]
            },
            'dumarao': {
                name: 'Dumarao, Capiz',
                coords: [11.267, 122.683],
                entries: [
                    {term: '[smiling face]', category: 'happy'},
                    {term: 'pain', category: 'pain'}
                ]
            },
            'hamtic': {
                name: 'Hamtic, Antique',
                coords: [10.7, 121.983],
                entries: [
                    {term: 'clothes [stained cloth]', category: 'cloth'},
                    {term: 'bad mood but happy', category: 'happy,bad-mood'},
                    {term: 'happy, sad, hurting', category: 'happy,sad,pain'}
                ]
            },
            'dacal': {
                name: 'Dacal',
                coords: [11.183, 122.517],
                entries: [
                    {term: 'masakit [sad face]', category: 'pain'},
                    {term: 'stressful [sad face]', category: 'stress'},
                    {term: 'balanyos [bottle of medicine], gamot sa pus-on', category: 'medicine'}
                ]
            },
            'tapaz': {
                name: 'Tapaz, Capiz',
                coords: [11.267, 122.533],
                entries: [
                    {term: 'cramps', category: 'pain'},
                    {term: 'tela', category: 'cloth'}
                ]
            },
            'nabas': {
                name: 'Nabas, Aklan',
                coords: [11.833, 122.083],
                entries: [
                    {term: 'kaba', category: 'nervousness'},
                    {term: 'masungit', category: 'bad-mood'}
                ]
            },
            'malay': {
                name: 'Malay, Aklan',
                coords: [11.9, 121.917],
                entries: [
                    {term: 'malungkot [sad face]', category: 'sadness'}
                ]
            },
            'pantad': {
                name: 'Pantad',
                coords: [11.133, 122.6],
                entries: [
                    {term: 'masakit pus-on', category: 'pain'},
                    {term: 'kalipay', category: 'happy'},
                    {term: 'kasakit', category: 'pain'},
                    {term: 'kasubo', category: 'sadness'},
                    {term: 'pasador', category: 'cloth'},
                    {term: 'napkins', category: 'napkin'}
                ]
            },
            'barotac': {
                name: 'Barotac Viejo, Iloilo',
                coords: [11.033, 122.85],
                entries: [
                    {term: 'bad mood', category: 'bad-mood'}
                ]
            },
            'iloilo-city': {
                name: 'Iloilo City',
                coords: [10.72, 122.562],
                entries: [
                    {term: 'happy ako kay mahambal ko na nga dalaga na ako', category: 'happy,dalaga'},
                    {term: 'para maging malinis sa katawan gumamit ng napkin at maligo', category: 'refreshed'}
                ]
            },
            'isabela': {
                name: 'Isabela',
                coords: [10.933, 122.433],
                entries: [
                    {term: 'cramps', category: 'pain'},
                    {term: 'irritable', category: 'bad-mood'},
                    {term: 'pangangalay', category: 'weakness'}
                ]
            }
        };

        // Initialize the map
        const map = L.map('panay-map').setView([11.2, 122.5], 8);

        // Add OpenStreetMap base layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Custom icon for markers
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: #FF4500; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">{count}</div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Add markers for each location
        Object.entries(locationData).forEach(([id, location]) => {
            const marker = L.marker(location.coords, {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background-color: #FF4500; width: ${20 + location.entries.length * 2}px; height: ${20 + location.entries.length * 2}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);">${location.entries.length}</div>`,
                    iconSize: [20 + location.entries.length * 2, 20 + location.entries.length * 2],
                    iconAnchor: [10 + location.entries.length, 10 + location.entries.length]
                })
            }).addTo(map);
            
            // Build popup content
            let popupContent = `<b>${location.name}</b><br>${location.entries.length} entries<hr>`;
            location.entries.forEach(entry => {
                popupContent += `• ${entry.term} <small>(${entry.category})</small><br>`;
            });
            
            marker.bindPopup(popupContent);
            
            // Add click handler for details panel
            marker.on('click', function() {
                const detailsPanel = document.getElementById('location-content');
                let detailsHtml = `<h4>${location.entries.length} Entries:</h4><ul class="entry-list">`;
                
                location.entries.forEach(entry => {
                    const categoryClass = entry.category.split(',')[0]; // Take first category for color
                    detailsHtml += `<li><span class="word ${categoryClass} size-3">${entry.term}</span> <small>(${entry.category})</small></li>`;
                });
                
                detailsHtml += '</ul>';
                document.querySelector('.location-title').textContent = location.name;
                detailsPanel.innerHTML = detailsHtml;
            });
        });

        // Add scale control
        L.control.scale().addTo(map);