#include<iostream>

#include <bits/stdc++.h>

using namespace std;


int main(){
    //number of trials
    unsigned int t;
    scanf("%d",&t);

    //polycrap coins 
    int n;

    //the sisters coins 
    unsigned int Coins[3];
    

    while(t!=0){
      
       scanf("%d %d %d %d",&Coins[0],&Coins[1],&Coins[2],&n);
	//sorting the coins 
        sort(Coins,Coins+3);

        n-=(2*Coins[2]-Coins[1]-Coins[0]);

        if(n<0||n%3!=0){
            printf("NO \n");
        }
        else{
            printf("Yes \n");
         }
        t--;
        }
    return 0;

}
