import { Session } from "next-auth";
import { Octokit } from "octokit";
import { randomColor } from "./color-conversion";

// TODO: Clean up this code and make it have better comments for each function

// function that will increase a key by a value if that key is present in a table,
// and create a key in the table with said value if it's not.
function incrementKey(table: { [key: string]: number }, key: string, value: number) {
    if (key in table) {
        table[key] += value;
    } else {
        table[key] = value;
    }
}

// function that rounds a number to a specific level of precision.
// precision = how many digits you would like the number to be rounded to.
// if precision is negative, it will chop off digits such as ones, tens, etc.
function preciseRound(num: number, precision: number) {
    precision = Math.floor(precision); // make sure precision isn't a decimal, because that causes weirdness

    let multiplier = Math.pow(10, precision);
    return Math.round(precision * multiplier) / multiplier;
}

function getUserFullName(session: Session) {
    return session.user.name;
}

function getEmail(session: Session) {
    return session.user.email;
}

function getProfilePicture(session: Session) {
    return session.user.image;
}

function getUserName(session: Session) {
    return session.user.userID;
}

async function getUserRepoList(session: Session) {
    const octokit = new Octokit({
        auth: session.user.accessToken
    })

    var { data: verboseRepoList } = await octokit.request('GET /user/repos', {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    var repoNameList = [];

    for (var i = 0; i < verboseRepoList.length; i++) {
        var { name: currentRepoName } = verboseRepoList[i];

        repoNameList.push(currentRepoName);
    }

    return repoNameList;
}

// TODO: Test me!
async function getUserLanguagePercentages(session: Session): Promise<{ [key: string]: number; }> {
    const octokit = new Octokit({
        auth: session.user.accessToken,
    })

    var repoNameList = await getUserRepoList(session);
    var languages: { [key: string]: number } = {};
    var languageSum = 0;
    var languagePercentages: { [key: string]: number } = {}

    // loop through every repo in the repo name list and get the language data for each repo
    for (var i = 0; i < repoNameList.length; i++) {
        var currentRepo = repoNameList[i];
        var { data: currentRepoLanguages } = await octokit.request('GET /repos/{owner}/{repo}/languages', {
            owner: getUserName(session),
            repo: currentRepo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        // loop through every language in the current repo
        // and add it to the languages list
        for (let key in currentRepoLanguages) {
            incrementKey(languages, key, currentRepoLanguages[key]);
        }
    }

    // get the total bytes of all the languages (used for calculating average)
    for (let language in languages) {
        languageSum += languages[language];
    }

    for (let language in languages) {
        var languageFraction = languages[language] / languageSum;
        var languageFormattedPercentage = preciseRound(languageFraction * 100, 1);

        languagePercentages[language] = languageFormattedPercentage;
    }

    return languagePercentages;
}

// TODO: Test me!
async function getPieChartReadyLanguageData(session: Session) {
    var languagePercentages = await getUserLanguagePercentages(session);
    var pieArray = [];

    for (let language in languagePercentages) {
        let table = {
            "name": language,
            "value": languagePercentages[language],
            "color": randomColor(68, 88, 40, 54).hex
        }

        pieArray.push(table);
    }

    return pieArray;
}