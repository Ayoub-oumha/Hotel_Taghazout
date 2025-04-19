<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
  
    public function register(Request $request){
            $validator = Validator::make($request->all() , [
                'name'=>'required|string|max:255' ,
                'email'=>'required|email|unique:users|max:255' ,
                'password'=>'required|string|max:12|min:8' ,
            ]) ;
            if($validator->fails()){
                return response()->json(['error' => $validator->errors(),422]) ;

            }
            $password = Hash::make($request->password);

            $user =  User::create([
                "name"=> $request->name ,
                "email"=>$request->email ,
                "password"=> $password ,
            ]) ;
            $token = JWTAuth::fromUser($user) ;
            
            return response()->json(['message' =>'you are registres succes' , 'user' => $user , 'token' => $token] , 201) ;
        }

        public function login(Request $request){
            
                $validator = Validator::make($request->all() , [
                    'email'=>'required|email|max:255' ,
                    'password'=>'required|string|max:12|min:8' ,
                ]) ;
                if($validator->fails()){
                    return response()->json(['error' => $validator->errors(),422]) ;
        
                }
                
                $user = User::where('email' , $request->email)->first();
                if(!$user){
                    return response()->json(['message' => 'email invalide']) ;
                }
                elseif(!Hash::check($request->password , $user->password)){
                    return response()->json(['message'=>'incorrect password']) ;
                }

               $token = JWTAuth::fromUser($user) ;
               return response()->json(["message"=> "login successfuly" , 'user' => $user->makeHidden("password") , 'token' => $token], 201) ;
            }
          
        public function logout(Request $request){
            // dd("hello") ;
            try {
                // Get token from the request
                $token = $request->bearerToken();
                
                if (!$token) {
                    return response()->json([
                        'status' => false,
                        'message' => 'No token provided'
                    ], 400);
                }
                
                // Set the token for JWTAuth to use
                JWTAuth::setToken($token);
                
                // Attempt to invalidate
                JWTAuth::invalidate();
                
                return response()->json([
                    'status' => true,
                    'message' => 'User logged out successfully'
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'message' => 'Sorry, the user cannot be logged out: ' . $e->getMessage()
                ], 500);
            }
        }
        public function index(){
            return [ "users"=> "this is message"] ;
        }
}
