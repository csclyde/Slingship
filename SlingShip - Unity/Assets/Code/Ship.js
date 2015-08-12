﻿#pragma strict
 
 private var planets : GameObject[];
 
 private var thrust : float = 0;
 var thrustPower : float = 1; 
 var maxFuel : float = 100;
 var currentFuel : float = -1; 
 var fuelUsage: float = 2; 
 static var t : Ship;
 var thrustRate: float = 0.3f;
 
 var bigParticle : ParticleSystem ;
 var smallParticle : ParticleSystem ; 
 var anim : Animator; 
 
 private var maxSpeedSM : float;
 private var maxLifeLG : float;
 private var maxSpeedLG : float;
 private var maxLifeSM: float; 
 private var hasFuel: boolean = true; 
 private var rigid : Rigidbody; 
 private var thrustSound : AudioSource;
 private var vMove : float; 
 
 private var velocity : Vector3 = Vector3.zero; 
 
 function updateThrust(){
 	anim.speed =  thrust; 
	 if(thrust > 0){
	 thrustSound.volume = thrust; 
	 	smallParticle.startLifetime = thrust * maxLifeSM; 
	 	//smallParticle.startSpeed = maxSpeedSM /3 * thrust +  2 *maxSpeedSM /3; 
	 	bigParticle.startLifetime = thrust * maxLifeLG; 
	 	//bigParticle.startSpeed = maxSpeedLG /3 * thrust + 2 *maxSpeedLG /3; 
 	}
 	else{
 	thrustSound.volume = Mathf.Lerp(thrustSound.volume, 0, Time.deltaTime * 10); 
 		smallParticle.startLifetime = 0; 
	 	//smallParticle.startSpeed =0; 
	 	bigParticle.startLifetime = 0; 
	 	//bigParticle.startSpeed = 0; 
 	}
 	if(hasFuel ){
 		
 	}
 	else{
 		
 	}
 }

 
 function getInput(){
 	vMove = Input.GetAxisRaw("Vertical"); 
 	
 	if(vMove > 0){
 		thrust += thrustRate * Time.deltaTime; 
 	}
 	if(vMove < 0){
 		thrust -= thrustRate * Time.deltaTime; 
 	}
 	if(vMove == 0){
 		thrust = Mathf.Lerp(thrust, 0, Time.deltaTime * 4); 
 	}

	if(thrust < -1) thrust = -1;
	if(thrust > 1) thrust = 1;
 }
 function modifyVelocity(val : Vector3 ){
 	velocity += val * Time.fixedDeltaTime * .1f;
 	//if(velocity.sqrMagnitude > 16) 
 }
 
  function useFuel(){
 	if(thrust != 0){
 		currentFuel -= fuelUsage * Time.deltaTime * Mathf.Abs(thrust); 
 		if(currentFuel <= 0){
 			currentFuel = 0; 
 			hasFuel = false; 
 		}
 		UIManager.updateFuel(currentFuel / maxFuel); 
 	}
 }
 
 function Start () {
 t = this; 
 thrustSound = GetComponent(AudioSource); 
 	//rigid = GetComponent(Rigidbody); 
     planets = GameObject.FindGameObjectsWithTag("Planet");
     maxSpeedSM = smallParticle.startSpeed;
     maxLifeSM = smallParticle.startLifetime; 
     maxSpeedLG = bigParticle.startSpeed; 
     maxLifeLG = bigParticle.startLifetime; 
     if(currentFuel == -1){
     	currentFuel = maxFuel;
     }
     UIManager.updateFuel(currentFuel / maxFuel);
 }
 
 function ClosestPlanet(){
 var index : int = 0; 
 var dist : float = 100000; 
 	for(var i : int = 0; i < planets.length; i++){
 	var tempDist : float = Vector3.Distance(transform.position, planets[i].transform.position);  
 		if( tempDist  < dist){
 			dist = tempDist;
 			index = i; 
 		} 
 	}
 	return planets[index]; 
 }
 function AddPlanetSpeed(thePlanet : Planet, dist : float ){
 	if(dist < 100){
 		transform.position += thePlanet.GetChange(); 
 		//rigid.AddForce(thePlanet.GetChange()); 
 	}
 }
 function GetPulled(){
 	var closetPlanet : GameObject = ClosestPlanet(); 
 	var vec : Vector3 = closetPlanet.transform.position - transform.position; 
 	var dir = vec.normalized; 
 	//vec -= dir * closetPlanet.GetComponent(Planet).radius / 10; 
 	var magSqr = vec.sqrMagnitude; 
 	if(magSqr <1){
 		magSqr = 1; 
 	}
 	var gravMod : Vector3 = closetPlanet.GetComponent(Planet).gravity * dir / magSqr * 30; 
 	Debug.Log(closetPlanet.name + " | " + gravMod.magnitude + " | " + gravMod); 
 	modifyVelocity(gravMod); 
 }
 
 
 function FixedUpdate () {
 
	 //GetPulled(); 
	 transform.rotation = Quaternion.LookRotation(velocity);
	 modifyVelocity(thrust * thrustPower * transform.forward);
	 GetPulled(); 
	 transform.position += velocity * Time.fixedDeltaTime; 
	 
	 transform.position = new Vector3(transform.position.x, transform.position.y,0); 
 /*
 
     for(var planet : GameObject in planets) {
     
         var dist = Vector3.Distance(planet.transform.position, transform.position);
         
         if(dist < 1) dist = 1;
         
         var maxDist = planet.GetComponent(Planet).gravity * 50;
         
         if (dist <= maxDist) {
         
             var v = planet.transform.position - transform.position - ((planet.transform.position - transform.position).normalized * planet.transform.localScale.x);
             
             var force = 10 * ((v.normalized * planet.GetComponent(Planet).adjustedGrav) / (dist * dist));
             
             
             force.z = 0;
             
             rigid.AddForce(force);
             
             rigid.velocity = Vector3.ClampMagnitude(rigid.velocity, 30);

             
             transform.rotation = Quaternion.LookRotation(rigid.velocity);
             //transform.LookAt(transform.position + rigid.velocity); 
             
             
             var thrustVec = transform.forward.normalized;
             thrustVec *= thrust * thrustPower;
             
             if(Input.GetKey("space")) {
             //rigid.AddForce(hMove * thrustPower * transform.up); 
             //Debug.DrawRay(transform.position, transform.up); 
             	if(Input.GetKey ("up")) {
             		rigid.AddForce(thrustVec);
             	} 
             }
             
         }
     }*/
 }
 
 function Update() {
 	getInput(); 
	updateThrust(); 
	useFuel(); 
 }
