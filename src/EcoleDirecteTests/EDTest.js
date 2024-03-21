
class Student {
    constructor(session, account) {
        this.session = session;
        this.id = account.id;
    }

    /**
    * Retrieves the student's grades
    * @param {Number} [quarter] (Optional) If you want a specific quarter
    */
    async getNotes(quarter) {
        try {
            const response = await this.session.request(
                `https://api.ecoledirecte.com/v3/eleves/${this.id}/notes.awp?verbe=get&`
            );

            if (quarter)
                return response.data.data.periodes.find(p => p.idPeriode === `A00${quarter}`);

            return response.data.data.notes;
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Retrieves the student's Homeworks
     */
    async getHomeworks() {
        try {
            const response = await this.session.request(
                `https://api.ecoledirecte.com/v3/Eleves/${this.id}/cahierdetexte.awp?verbe=get&`
            );

            let homework = response.data.data;

            for (const date of Object.keys(response.data.data)) {
                const homeworkResponse = await this.session.request(
                    `https://api.ecoledirecte.com/v3/Eleves/${this.id}/cahierdetexte/${date}.awp?verbe=get&`
                );

                homeworkResponse.data.data.matieres.map(x => {
                    if (x.aFaire && x.aFaire.contenu) {
                        let buff = Buffer.from(x.aFaire.contenu, 'base64');
                        let detail = buff
                            .toString('ascii')
                            .replace(/<\/?[^>]+(>|$)/g, "")
                            .replace(/&eacute;/g, "é")
                            .replace(/&egrave;/g, "è")
                            .replace(/&ecirc;/g, "ê")
                            .replace(/&agrave;/g, "à")
                            .replace(/&nbsp;/g, " ")
                            .replace(/&Iuml;/g, "Ï")
                            .replace(/&deg;/g, "°")
                            .replace(/&#39;/g, "'")
                            .replace(/&ccedil;/g, "ç")
                            .trim();

                        let temp = homework[date].find(y => y.idDevoir === x.id); // Utilisation de === pour la comparaison
                        temp.content = detail;
                        temp.teacher = x.nomProf.substr(5);
                    }
                });
            }

            return homework;
        } catch (err) {
            throw new Error(err);
        }
    }

    // Les autres méthodes sont laissées telles quelles
}

class Family {
    constructor(session, account) {
        this.session = session;
        this.data = account;
    }

    /**
    * Retrieves the student's informations
    * @param {String} token
    */
    async getChild(token) {
        try {
            const childs = this.data.accounts[0].profile.eleves;

            this.members = childs.map(
                (child) => new Student(this.session, child)
            );

            const response = await this.session.request(
                "https://api.ecoledirecte.com/v3/contactetablissement.awp?verbe=get&",
                token
            );

            this.session.token = response.data.token; // Utilisation de response.data.token

            return response.data.data;
        } catch (err) {
            throw new Error(err);
        }
    }
}

class Session {
    constructor() {}

    async login(login, password) {
        try {
            const response = await axios.post(
                "https://api.ecoledirecte.com/v3/login.awp",
                `data={"identifiant": "${login}", "motdepasse": "${password}"}`
            );

            if (response.data.code === 505)
                throw new Error("Erreur de connexion : identifiants invalides.");

            const account = response.data.data.accounts[0];

            if (account.typeCompte === "E") {
                const student = new Student(this, account);
                this.token = response.data.token;
                return student;
            } else if (account.typeCompte === "Famille") {
                const family = new Family(this, response.data.data);
                await family.getChild(response.data.token); // Correction pour appeler la méthode getChild
                return family;
            }

            return this;
        } catch (err) {
            throw new Error(err);
        }
    }

    async request(url, args = {}) {
        try {
            const response = await axios.post(
                url,
                `data=${JSON.stringify({
                    ...args,
                    ...{ token: this.token }
                })}`
            );
            return response;
        } catch (err) {
            throw new Error(err);
        }
    }
}

(async () => {
    const session = new Session();
    try {
        const account = await session.login("Martin koscianski", "Tigrou075");
        console.log(account);
        console.log(await account.getNotes());
    } catch (error) {
        console.error(error);
    }
})();
