import { FadeViewComponent } from "../../playground/fade_view_component";
import { FunComponent } from "../../playground/fun_component";
import { GrabbableSpawnerComponent } from "../../playground/grabbable_spawner_component";
import { LoadAudioComponent } from "../../playground/load_audio_component";
import { ParticleComponent } from "../../playground/particle_component";
import { ParticlesSpawnerComponent } from "../../playground/particles_spawner_component";
import { PlayMusicComponent } from "../../playground/play_music_component";
import { ScaleOnSpawnComponent } from "../../playground/scale_on_spawn_component";
import { SFXOnCollisionComponent } from "../../playground/sfx_on_collision_component";
import { SFXOnGrabThrowComponent } from "../../playground/sfx_on_grab_throw_component";
import { TargetHitCheckComponent } from "../../playground/target_hit_check_component";
import { WaveMovementComponent } from "../../playground/wave_movement_component";
import { DevileryGatewayComponent } from "./devilery_gateway";

export function initDevilery(engine) {
    registerPlaygroundComponents(engine);

    registerDevileryComponents(engine);
}

export function registerPlaygroundComponents(engine) {
    engine.registerComponent(FadeViewComponent);
    engine.registerComponent(GrabbableSpawnerComponent);
    engine.registerComponent(LoadAudioComponent);
    engine.registerComponent(ParticleComponent);
    engine.registerComponent(ParticlesSpawnerComponent);
    engine.registerComponent(PlayMusicComponent);
    engine.registerComponent(ScaleOnSpawnComponent);
    engine.registerComponent(SFXOnCollisionComponent);
    engine.registerComponent(SFXOnGrabThrowComponent);
    engine.registerComponent(TargetHitCheckComponent);
    engine.registerComponent(WaveMovementComponent);
    engine.registerComponent(FunComponent);
}

export function registerDevileryComponents(engine) {
    engine.registerComponent(DevileryGatewayComponent);
}