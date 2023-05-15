import { Component } from "@wonderlandengine/api";
import { GameGlobals } from "../game_globals";

export class SendAllEventsComponent extends Component {
    static TypeName = "send-all-events";
    static Properties = {
    };

    start() {
        if (GameGlobals.myGoogleAnalytics) {
            gtag("event", "button_pressed", {
                "value": 1
            });
            gtag("event", "enter_vr", {
                "value": 1
            });
            gtag("event", "intro_watched", {
                "value": 1
            });
            gtag("event", "intro_skipped", {
                "value": 1
            });
            gtag("event", "intro_done", {
                "value": 1
            });
            gtag("event", "ending_watched", {
                "value": 1
            });
            gtag("event", "ending_skipped", {
                "value": 1
            });
            gtag("event", "ending_done", {
                "value": 1
            });
            gtag("event", "moving", {
                "value": 1
            });
            gtag("event", "moving_non_vr", {
                "value": 1
            });
            gtag("event", "moving_vr", {
                "value": 1
            });
            gtag("event", "switch_teleport", {
                "value": 1
            });
            gtag("event", "lost", {
                "value": 1
            });
            gtag("event", "kill_bird", {
                "value": 1
            });
            gtag("event", "kill_bird_normal", {
                "value": 1
            });
            gtag("event", "kill_bird_strong", {
                "value": 1
            });
            gtag("event", "kill_bird_shield", {
                "value": 1
            });
            gtag("event", "kill_delivery_guy", {
                "value": 1
            });
            gtag("event", "buy_weapon", {
                "value": 1
            });
            gtag("event", "buy_apple", {
                "value": 1
            });
            gtag("event", "buy_bat", {
                "value": 1
            });
            gtag("event", "buy_skull", {
                "value": 1
            });
            gtag("event", "buy_voice", {
                "value": 1
            });
            gtag("event", "grab_weapon", {
                "value": 1
            });
            gtag("event", "grab_apple", {
                "value": 1
            });
            gtag("event", "grab_bat", {
                "value": 1
            });
            gtag("event", "grab_skull", {
                "value": 1
            });
            gtag("event", "grab_voice", {
                "value": 1
            });
            gtag("event", "shot_weapon", {
                "value": 1
            });
            gtag("event", "shot_apple", {
                "value": 1
            });
            gtag("event", "shot_bat", {
                "value": 1
            });
            gtag("event", "shot_skull", {
                "value": 1
            });
            gtag("event", "shot_voice", {
                "value": 1
            });
            gtag("event", "princess_delovery", {
                "value": 1
            });
            gtag("event", "survive_30_seconds", {
                "value": 1
            });
            gtag("event", "survive_1_minute", {
                "value": 1
            });
            gtag("event", "survive_2_minutes", {
                "value": 1
            });
            gtag("event", "survive_3_minutes", {
                "value": 1
            });
            gtag("event", "survive_5_minutes", {
                "value": 1
            });
            gtag("event", "survive_seconds", {
                "value": 1
            });
            gtag("event", "evilness_gained", {
                "value": 1
            });
        }
    }
}