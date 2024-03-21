async function connect(username, password) {
    try {
        const response = await axios.post(
            "https://api.ecoledirecte.com/v3/login.awp",
            `data={"identifiant": "${username}", "motdepasse": "${password}"}`
        );

        return response.data.code !== 505;
    } catch (err) {
        console.error(err);
        return false;
    }
}



(async () => {
    try {
        const isConnected = await connect("Martin koscianski", "Tigrou075");
        console.log("Connection établie :", isConnected);
    } catch (error) {
        console.error(error);
    }
})();

class Session {
    constructor() {}

    async loginAndGetToken(login, password) {
        try {
            const response = await axios.post(
                "https://api.ecoledirecte.com/v3/login.awp",
                `data={"identifiant": "${login}", "motdepasse": "${password}"}`
            );

            if (response.data.code === 505)
                throw new Error("Erreur de connexion : identifiants invalides.");

            const account = response.data.data.accounts[0];

            if (account.typeCompte === "E") {
                return response.data.token;
            } else if (account.typeCompte === "Famille") {
                const family = new Family(this, response.data.data);
                await family.getChild(response.data.token); // Correction pour appeler la méthode getChild
                return response.data.token;
            }

            return null;
        } catch (err) {
            throw new Error(err);
        }
    }
}

async function getTokenForAccount(username, password) {
    const session = new Session();
    try {
        const token = await session.loginAndGetToken(username, password);
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

(async () => {
    const token = await getTokenForAccount("Martin koscianski", "Tigrou075");
    console.log(token);
})();

