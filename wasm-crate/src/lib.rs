use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct RotationSpeeds {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Satellite {
    pub name: String,
    pub orbit_radius: f32,
    pub orbit_speed: f32,
    pub rotation_speeds: RotationSpeeds,
    pub color: u32,
    pub angle: f32,
    pub x: f32,
    pub z: f32,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Planet {
    pub name: String,
    pub orbit_radius: f32,
    pub orbit_speed: f32,
    pub rotation_speeds: RotationSpeeds,
    pub color: u32,
    pub angle: f32,
    pub x: f32,
    pub z: f32,
    pub satellites: Vec<Satellite>,
}

#[wasm_bindgen]
pub struct SolarSystem {
    planets: Vec<Planet>,
    sun_rotation_y: f32,
}

#[wasm_bindgen]
impl SolarSystem {
    #[wasm_bindgen(constructor)]
    pub fn new() -> SolarSystem {
        SolarSystem {
            planets: Vec::new(),
            sun_rotation_y: 0.0,
        }
    }

    pub fn add_planet(&mut self, name: String, orbit_radius: f32, orbit_speed: f32, rx: f32, ry: f32, rz: f32, color: u32) {
        let initial_angle = js_sys::Math::random() as f32 * 2.0 * std::f32::consts::PI;
        self.planets.push(Planet {
            name,
            orbit_radius,
            orbit_speed,
            rotation_speeds: RotationSpeeds { x: rx, y: ry, z: rz },
            color,
            angle: initial_angle,
            x: orbit_radius * initial_angle.cos(),
            z: orbit_radius * initial_angle.sin(),
            satellites: Vec::new(),
        });
    }

    pub fn add_satellite(&mut self, planet_name: String, name: String, orbit_radius: f32, orbit_speed: f32, rx: f32, ry: f32, rz: f32, color: u32) {
        if let Some(planet) = self.planets.iter_mut().find(|p| p.name == planet_name) {
            let initial_angle = js_sys::Math::random() as f32 * 2.0 * std::f32::consts::PI;
            planet.satellites.push(Satellite {
                name,
                orbit_radius,
                orbit_speed,
                rotation_speeds: RotationSpeeds { x: rx, y: ry, z: rz },
                color,
                angle: initial_angle,
                x: orbit_radius * initial_angle.cos(),
                z: orbit_radius * initial_angle.sin(),
            });
        }
    }

    pub fn update(&mut self, delta_time: f32) {
        self.sun_rotation_y -= 0.01 * delta_time;
        for planet in &mut self.planets {
            planet.angle += (1.0 / planet.orbit_speed) * 0.001 * delta_time;
            planet.x = planet.orbit_radius * planet.angle.cos();
            planet.z = planet.orbit_radius * planet.angle.sin();

            for satellite in &mut planet.satellites {
                satellite.angle += (1.0 / satellite.orbit_speed) * 0.001 * delta_time;
                satellite.x = satellite.orbit_radius * satellite.angle.cos();
                satellite.z = satellite.orbit_radius * satellite.angle.sin();
            }
        }
    }

    pub fn get_planets(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.planets).unwrap()
    }

    pub fn get_sun_rotation_y(&self) -> f32 {
        self.sun_rotation_y
    }
}

#[wasm_bindgen]
pub fn calculate_camera_position(scroll_y: f32, sun_radius: f32) -> Vec<f32> {
    let distance = 2.5 * sun_radius;
    let angle = scroll_y * 0.002;
    let x = distance * angle.cos();
    let y = scroll_y * 0.009;
    let z = distance * (-angle).sin();
    vec![x, y, z]
}

#[wasm_bindgen]
pub fn generate_stars(amount: u32, min_radius: f32, max_radius: f32) -> Vec<f32> {
    let mut stars = Vec::with_capacity((amount * 3) as usize);
    let pi = std::f32::consts::PI;
    
    for _ in 0..amount {
        // Random spherical coordinates for even distribution
        let theta = js_sys::Math::random() as f32 * 2.0 * pi;
        let u = js_sys::Math::random() as f32 * 2.0 - 1.0;
        let phi = u.acos();
        
        // Random radius within the shell
        let r = min_radius + (js_sys::Math::random() as f32 * (max_radius - min_radius));
        
        // Convert to Cartesian
        let x = r * phi.sin() * theta.cos();
        let y = r * phi.sin() * theta.sin();
        let z = r * phi.cos();
        
        stars.push(x);
        stars.push(y);
        stars.push(z);
    }
    stars
}