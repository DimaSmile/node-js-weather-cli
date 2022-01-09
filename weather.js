#!/usr/bin/env node

import { getArgs } from "./helpers/args.js"
import { printError, printHelp, printSuccess, printWeather } from "./services/log.service.js";
import {getKeyValue, saveKeyValue, TOKEN_DICTIONARY} from "./services/storage.service.js";
import {getIcon, getWeather} from "./services/api.service.js";
import log from "../esmodule/characters.mjs";

const saveToken = async (token) => {
    if (!token.length) {
        printError('Token was not specified!');
        return;
    }

    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token);
        printSuccess('Token was saved');
    } catch (e) {
        printError(e.message);
    }
};

const saveCity = async (city) => {
    if (!city.length) {
        printError('City was not specified!');
        return;
    }

    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city);
        printSuccess('City was saved');
    } catch (e) {
        printError(e.message);
    }
};

const getForecast = async () => {
    try {
        const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city);
        const weather = await getWeather(city);
        const icon = getIcon(weather.weather[0].icon);

        printWeather(weather, icon)
    } catch (e) {
        switch (e?.response?.status) {
            case 404:
                printError('Token is incorrect!');
                return;
            case 401:
                printError('City is incorrect!');
                return;
            default:
                printError(e.message);
        }
    }
};

const initCLI = () => {
    const args = getArgs(process.argv);

    if (args.h) {
        printHelp();
    }

    if (args.s) {
        return saveCity(args.s);
    }

    if (args.t) {
        return saveToken(args.t);
    }

    getForecast();

    //Output weather
};

initCLI()
