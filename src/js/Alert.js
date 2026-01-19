import AlertJson from "../json/alert.json" assert { type: "json" };

export default class Alert {

    constructor(mainSelector = "main") {

        this.alerts = AlertJson;
        this.mainElement = document.querySelector(mainSelector);
    }


    init() {
        //console.log(this.alerts, "Alert initialized");
        if (!this.mainElement) return;

        if (!this.alerts || this.alerts.length === 0) return;

        const section = document.createElement("section");
        section.classList.add("alert-list");

        this.alerts.forEach((alert => {
            const p = document.createElement("p");
            p.textContent = alert.message;
            p.style.backgroundColor = alert.background;
            p.style.color = alert.color;
            section.appendChild(p);
        }));

        this.mainElement.prepend(section);

    }

}