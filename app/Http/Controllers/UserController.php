<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Workbench\App\Models\User as ModelsUser;

class UserController extends Controller
{
  
    public function register(Request $request){
            $validator = Validator::make($request->all() , [
                'name'=>'required|string|max:255' ,
                'email'=>'required|email|unique:users|max:255' ,
                'password'=>'required|string|min:8' ,
            ]) ;
            if($validator->fails()){
                return response()->json(['error' => $validator->errors()], 422) ;
            }
            
            $user = User::create([
                "name"=> $request->name,
                "email"=> $request->email,
                "role" => "user" ,
                "password"=> Hash::make($request->password),
            ]);
            
            // Génère token avec Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;
            
            return response()->json([
                'message' => 'Vous êtes enregistré avec succès',
                'user' => $user,
                'token' => $token
            ], 201);
        }

        public function login(Request $request){
            
                $validator = Validator::make($request->all() , [
                    'email'=>'required|email|max:255' ,
                    'password'=>'required|string|min:8' ,
                ]) ;
                if($validator->fails()){
                    return response()->json(['error' => $validator->errors()], 422) ;
                }
                
                $user = User::where('email', $request->email)->first();
                
                if(!$user){
                    return response()->json(['message' => 'Email invalide'], 401);
                }
                
                if(!Hash::check($request->password, $user->password)){
                    return response()->json(['message' => 'Mot de passe incorrect'], 401);
                }

     
                $user->tokens()->delete();
                
          
                $token = $user->createToken('auth_token')->plainTextToken;
                
                return response()->json([
                    "message" => "Connecté avec succès", 
                    'user' => $user->makeHidden("password"),
                    'token' => $token
                ], 200);
            }
          
        public function logout(Request $request){
            // Supprime tous les tokens de l'utilisateur authentifié
            $request->user()->tokens()->delete();
            
            return response()->json([
                'status' => true,
                'message' => 'Déconnexion réussie'
            ], 200);
        }
        
        public function index(){
            $users = User::all() ;
            return response()->json(["users"=> $users] , 200) ;
        }
        public function store(Request $request ){
            $validator = Validator::make($request->all() , 
            ['name'=>'required|string|max:255' ,
            'email' => 'required|email|unique:users|string|max:255',
            'role' => 'required|string|max:20',
            'password'=> 'required|min:8']);

            if($validator->fails()){
                return response()->json(["message"=> $validator->errors()], 422) ;
            }
            $user = User::create([
                'name'=> $request->name ,
                'email' => $request->email ,
                'role' =>$request->role ,
                'password' => Hash::make($request->password)  ,
            ]) ;
            if($user) {
                return response()->json(["message" => "user created success" ,
                                         "user"=> $user]) ;
            }
            
        }
        public function show( Request $request , $id){
            $user = User::find($id) ;

            return ["user" => $user];
        }
        public function update ( Request $request , $id){
            $user = User::find($id) ;
            if(!$user) { 
                return response()->json(["message" => "user not font"] , 404);
            }
            $validator = Validator::make($request->all() , [
                'name' => 'required|string|max:255' ,
                'email' => 'required|string|email|max:255' ,
                'role' => 'required|string|max:255',
                
            ]) ;
            if($validator->fails()) {
                return response()->json(["message " => "error" , "errors" =>$validator->errors() ], 422) ;
            }
            if( $request->password || strlen($request->password) > 0){
                if( strlen($request->password) < 8 ){
                    return response()->json(["message" => "error password min 8"]) ;
                }
                $newPassword = Hash::make($request->password)  ;
                $user->update(
                    ['name' => $request->name ,
                    'email' => $request->email,
                    'role' => $request->role,
                    'password' => $newPassword,]
                    ) ;
            }
            else {
                $user->update(
                    ['name' => $request->name ,
                    'email' => $request->email,
                    'role' => $request->role,
                   ]
                ) ;
            }
           
            return response()->json(["message"=> "user updated succes" , "user" => $user] , 200) ;
        }
        public function destroy( Request $request , $id){
            $user = User::find($id) ;
            if(!$user) {
                return response()->json(["message"=> "user not fond"] , 404) ;
            }
            $user->delete();
            return response()->json(["message" => "user deleted successfully"]) ;
        }
}