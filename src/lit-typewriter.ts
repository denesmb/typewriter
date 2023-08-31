import { LitElement, css, html } from "lit";
import { classMap } from "lit-html/directives/class-map";
import { customElement, property } from "lit/decorators.js";

/**
 * A simple Typewriter element.
 */
@customElement("lit-typewriter")
export class LitTypewriter extends LitElement {
  static override styles = css`
    :host {
      display: inline;

      color: var(--typewriter-color);
      font-family: var(--typewriter-font-family);
      font-size: var(--typewriter-font-size);
      font-weight: var(--typewriter-font-weight);
      background-color: var(--typewriter-background-color);
      background: var(--typewriter-background);
      text-transform: var(--typewriter-text-transform);
    }

    .withCursor::after {
      content: var(--typewriter-cursor, "▮");
      font-size: var(--typewriter-cursor-font-size);
      color: var(--typewriter-cursor-color);
      animation-name: var(--typewriter-cursor-animation-name, blink);
      animation-duration: var(--typewriter-cursor-animation-speed, 0.5s);
      animation-timing-function: var(
        --typewriter-cursor-animation-easing,
        cubic-bezier(0.4, 0, 0.2, 1)
      );
      animation-iteration-count: infinite;
    }

    .withCursor.isTyping::after {
      animation: none;
    }

    @keyframes blink {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `;

  /**
   * Array of strings to display.
   */
  @property({
    type: Array,
    reflect: true,
  })
  strings: string[] = ["Hello World!", "I'm a Typewriter."];

  /**
   * Defines whether to show the cursor or not.
   * Default: true
   */
  @property({ type: Boolean })
  noCursor: boolean = false;

  /**
   * Delay after typing a character, in milliseconds.
   * Default: 100
   */
  @property({ type: Number })
  typingDelay: number = 100;

  /**
   * Delay after erasing a character, in milliseconds.
   * Default: 17
   */
  @property({ type: Number })
  erasingDelay: number = 17;

  /**
   * Delay after typing a string, in milliseconds.
   * Default: 1000
   */
  @property({ type: Number })
  delayAfterTyping: number = 1000;

  /**
   * Delay after erasing a string, in milliseconds.
   * Default: 500
   */
  @property({ type: Number })
  delayAfterErasing: number = 500;

  /**
   * Defines whether typing should have a natural effect.
   * When set to true, the typing delay will be multiplied
   * by a random number between 0.5 and 1.5, resulting in a
   * more natural typing effect.
   * Default: false.
   */
  @property({ type: Boolean })
  natural: boolean = false;

  /**
   * Array of indices of strings that should be typed right-to-left.
   * Default: []
   */
  @property({ type: Array })
  rtlStringIndices: number[] = [];

  @property({ type: String })
  typedText: string = "";

  currentStringIndex: number = 0;

  @property({ type: Boolean })
  isTyping: boolean = false;

  override connectedCallback() {
    super.connectedCallback();
    this._type();
  }

  private _type = () => {
    const currentString = this.strings[this.currentStringIndex];
    if (this.typedText.length < currentString.length) {
      this.isTyping = true;
      this.typedText += currentString[this.typedText.length];
      const delay = this.natural
        ? Math.max((Math.random() + 0.5) * this.typingDelay, 17)
        : this.typingDelay;
      setTimeout(this._type, delay);
    } else {
      this.isTyping = false;
      setTimeout(this._erase, this.delayAfterTyping);
    }
  };

  private _erase = () => {
    if (this.erasingDelay === 0) {
      this.typedText = "";
      this.currentStringIndex = ++this.currentStringIndex % this.strings.length;
      setTimeout(this._type, this.delayAfterErasing + this.typingDelay);
    } else {
      if (this.typedText.length > 0) {
        this.isTyping = true;
        this.typedText = this.typedText.slice(0, this.typedText.length - 1);
        setTimeout(this._erase, this.erasingDelay);
      } else {
        this.isTyping = false;
        this.currentStringIndex =
          ++this.currentStringIndex % this.strings.length;
        setTimeout(this._type, this.delayAfterErasing + this.typingDelay);
      }
    }
  };

  private _getDirection = () =>
    this.rtlStringIndices.indexOf(this.currentStringIndex) > -1 ? "rtl" : "ltr";

  override render() {
    return html`<span
      dir="${this._getDirection()}"
      class=${classMap({
        text: true,
        withCursor: !this.noCursor,
        isTyping: this.isTyping,
      })}
      >${this.typedText}</span
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-typewriter": LitTypewriter;
  }
}
