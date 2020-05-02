import { LitElement, html, customElement, property } from "lit-element";
import "./lit-typewriter";

@customElement("lit-demo")
export class LitDemo extends LitElement {

    @property({ type: Array })
    strings: string[] = ["This is", "a demo."];

    render() {
        return html`
            <div>
                <div part="demo">
                    <lit-typewriter .strings="${this.strings}"></lit-typewriter>
                </div>
                <div part="demo">
                    <lit-typewriter
                        .strings="${["I speak English, magyar, עברית, and العربية."]}"
                    ></lit-typewriter>
                </div>
                <div part="demo" style="text-align: center">
                    <lit-typewriter
                        .rtlStringIndices="${[0]}"
                        .strings="${["שלום, שמי דנש.", "Hi, I'm Dénes."]}"
                    ></lit-typewriter>
                </div>
                <div part="demo">
                    <span>
                        I am <lit-typewriter
                            .natural="${true}"
                            .erasingDelay="${0}"
                            .delayAfterErasing="${0}"
                            .showCursor="${false}"
                            .strings="${[
                "a native web component.",
                "available as an NPM package.",
                "built using LitElement.",
                "using CSS Custom Properties."
            ]}"
                        ></lit-typewriter>
                    </span>
                </div>
            </div>
        `
    }
}