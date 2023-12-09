const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6421665175:AAGmMO18NWsxTNiXPiUgUv8rJw34AnDX61I'; // Replace with your actual bot token
const rapidApiKey = '4a1b065cbbmsh22b69c11c6120a3p122570jsne99d9a78fa7b'; // Replace with your RapidAPI key
const rapidApiHost = 'trains.p.rapidapi.com'; // Train API host

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const text = msg.text.trim();

    if (text.toLowerCase() === 'hi') {
        bot.sendMessage(msg.chat.id, 'Hello, my dear user');
    } else {
        // Prepare the API request to get train information based on the user-provided train name
        const options = {
            method: 'POST',
            url: 'https://trains.p.rapidapi.com/',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': rapidApiHost,
            },
            data: { search: text } // Use the text directly as the train name
        };

        try {
            const response = await axios.request(options);
            const trainData = response.data[0]; // Assuming the API returns the train data as an array

            if (trainData) {
                bot.sendMessage(msg.chat.id, `Train Name: ${trainData.name}`);
                bot.sendMessage(msg.chat.id, `Arrival Time: ${trainData.data.arriveTime}`);
                bot.sendMessage(msg.chat.id, `Departure Time: ${trainData.data.departTime}`);
                bot.sendMessage(msg.chat.id, `Train From: ${trainData.train_from}`);
            } else {
                bot.sendMessage(msg.chat.id, 'Train not found');
            }
        } catch (error) {
            console.error(error);
            bot.sendMessage(msg.chat.id, 'An error occurred while fetching train information');
        }
    }
});




