import axios from 'axios';

import Student from './Student';

class Session {
    constructor() {
        this.api = "https://api.ecoledirecte.com/v3";
    }

    async login(username, password) {
        try {
            const url = "/login.awp";
            const data = {
                identifiant: username,
                motdepasse: password
            };
            const response = await axios.post(
                this.api + url,
                `data=${JSON.stringify(data)}`
            );

            if (response.data.code === 505) {
                return {error: true, message: response.data.message};
            } else {
                const account = response.data.data.accounts[0];

                if (account.typeCompte === "E") {
                    return {error: false, account: account, token: response.data.token};
                } else {
                    return {error: true, message: "Ce type de compte n'est pas supporté"};
                }
            }
        } catch (err) {
            return {error: true, message: "Erreur : contacter le supprot"};
        }
    }

}

export default Session;