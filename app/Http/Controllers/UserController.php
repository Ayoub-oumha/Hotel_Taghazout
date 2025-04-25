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
           return response()->json(['users' => $users] , 200) ;
        }
        public function store(){
            return ["users" => "this is message"];
        }
        public function show( Request $request){
            return ["users" => "this "];
        }
        public function update ( Request $request){
            return ["users" => "this is message"];
        }
        public function destroy( Request $request){
            return ["users" => "this is message"];
        }
}