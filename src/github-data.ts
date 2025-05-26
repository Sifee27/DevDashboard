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

    var verboseRepoList = await octokit.request('GET /user/repos', {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    var repoNameList = [];

    for (var i = 0; i < verboseRepoList.data.length; i++) {
        var { name: currentRepoName } = verboseRepoList.data[i];

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

    for (var i = 0; i < (await repoNameList).length; i++) {
        var currentRepoName = repoNameList[i];
        var currentRepoLanguages = await octokit.request('GET /repos/{owner}/{repo}/languages', {
            owner: getUserName(session),
            repo: currentRepoName,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        // TODO: iterate through currentRepoLanguages and add each one to repoLanguages
    }
}