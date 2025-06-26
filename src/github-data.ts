import { Session } from "next-auth";
import { Octokit } from "octokit";

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

    var {data: verboseRepoList} = await octokit.request('GET /user/repos', {
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

async function getUserLanguagePercentages(session: Session) {
    const octokit = new Octokit({
        auth: session.user.accessToken,
    })

    var repoNameList = await getUserRepoList(session);
    var repoLanguages = {};

    for (var i = 0; i < repoNameList.length; i++) {
        var currentRepoName = repoNameList[i];
        var { data: currentRepoLanguages } = await octokit.request('GET /repos/{owner}/{repo}/languages', {
            owner: getUserName(session),
            repo: currentRepoName,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        var repoLangs = Object.keys(currentRepoLanguages);
        
        /* This is commented out because it creates errors.
           I will not be fixing them for the time being because I need a break.
           Typescript is giving me a headache. I can't see how it benefits anyone.
        for (var j = 0; j < repoLangs.length; j++) {
            var language = repoLangs[j];

            if (!repoLanguages.hasOwnProperty(language)) {
                repoLanguages[language] = 0;
            }

            repoLanguages[language] += currentRepoLanguages[language];
        }*/
    }
}