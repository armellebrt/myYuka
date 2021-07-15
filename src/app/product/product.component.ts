import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  search: any;
  brand: any;
  productName: any;
  palmOil: any;
  ingredients: any;
  allergen: any;
  quantity: any;
  nutriscore: any;
  imageProduct: any;
  nutriscoreColor: any;
  nutritionImage: any;
  nova: any;
  stores: any;
  ecoscore: any;
  categories: any;
  colorNova: any;
  novaGroup: any;
  barCode: any;
  localOrigins: any;
  percentLocal: any;
  labels: any;
  bioLabel: any;
  note: any;
  nutriscoreGroup: any;
  ecoscoreGroup: any;
  isLoaded: boolean;

  constructor(private http: HttpClient) { 
    this.categories = [];
    this.isLoaded = false;
  }

  ngOnInit(): void {
  }

  getInfo(){
    this.localOrigins = false;
    this.search = this.search.replace(/\s/g, '');
    this.search = this.search.replace(/\./g, '');

    this.http.get("https://fr.openfoodfacts.org/api/v0/product/"+ this.search + ".json") 
    .subscribe((data: any) => {
      this.isLoaded = true;
      this.brand = data["product"]["brands"];
      this.productName = data["product"]["product_name"];
      this.palmOil = data["product"]["ingredients_from_or_that_may_be_from_palm_oil_n"];
      this.ingredients = data["product"]["ingredients_text"];
      this.allergen = data["product"]["allergens_imported"];
      this.quantity = data["product"]["quantity"];
      this.nutriscoreGroup = data["product"]["nutriscore_grade"]
      this.nutriscore = "https://static.openfoodfacts.org/images/misc/nutriscore-" + this.nutriscoreGroup + ".svg"; 
      this.imageProduct = data["product"]["image_front_url"];
      this.nutritionImage = data["product"]["image_nutrition_url"];
      this.novaGroup = data["product"]["nova_group"]
      this.nova = "https://static.openfoodfacts.org/images/attributes/nova-group-" + this.novaGroup + ".svg"; 
      this.stores = data["product"]["stores_tags"];
      this.ecoscoreGroup = data["product"]["ecoscore_grade"];
      if( this.ecoscoreGroup == "not-applicable" ){
        this.ecoscoreGroup = 'unknown'
      }
      this.ecoscore = "https://static.openfoodfacts.org/images/attributes/ecoscore-" + this.ecoscoreGroup + ".svg" ;
      this.categories = data["product"]["categories"];
      this.barCode = data["code"];
      this.labels = data["product"]["labels"];

      if(this.nova == 'https://static.openfoodfacts.org/images/attributes/nova-group-undefined.svg'){
        this.nova = 'https://static.openfoodfacts.org/images/attributes/nova-group-unknown.svg';
      }
      if(
        data["product"]["ecoscore_data"]["adjustments"]["origins_of_ingredients"] &&
        data["product"]["ecoscore_data"]["adjustments"]["origins_of_ingredients"]["aggregated_origins"][0]["origin"] == "en:france"
      ){
        this.localOrigins = true;
        this.percentLocal = Math.round(data["product"]["ecoscore_data"]["adjustments"]["origins_of_ingredients"]["aggregated_origins"][0]["percent"]);
      }

      if(data["product"]["nutriscore_grade"] == undefined){
        this.nutriscore = "https://static.openfoodfacts.org/images/attributes/nutriscore-unknown.svg";
      }
      
      if(/[_]/.test(this.ingredients ) == true){
        this.ingredients = this.ingredients.replaceAll('_', '');
      }

      this.categories = this.categories.split(',');
    });
  }

  getColor(){
    this.note = 0;
    switch(this.nutriscoreGroup){
      case "a":
        this.note += 2;
        break;
      case "b":
        this.note++;
        break;
      case "d": 
        this.note--;
        break;
      case "e": 
        this.note-=2;
        break;
      default:
        this.note = this.note;
    }

    switch(this.ecoscoreGroup){
      case "a":
        this.note += 2;
        break;
      case "b":
        this.note++;
        break;
      case "d": 
        this.note--;
        break;
      case "e": 
        this.note-=2;
        break;
      default:
        this.note = this.note;
    }

    switch(this.novaGroup){
      case 1:
        this.note += 2;
        break;
      case 2:
        this.note++;
        break;
      case 4: 
        this.note--;
        break;
      default:
        this.note = this.note;
    }
  
    if(this.palmOil >= 1){
      this.note--;
    }

    switch(this.note){
      case 6:
      case 5:
      case 4:
        return "rgb(25 125 17)";
      case 3:
      case 2:
      case 1:
        return "#629815";
      case 0:
      case -1:
      case -2:
        return "#b88a14";
      case -3:
      case -4:
      case -5:
      case -6:
        return "rgb(189 53 39)";
      default:
        return "#629815";
    }
  }

  getLabel(){
    this.labels = this.labels.split(',');
    for(let i of this.labels){
      if(/Bio européen/.test(i)){
        this.bioLabel.push(i)
      } else if(/Bio/.test(i)){
        this.bioLabel.push(i)
      }
    }
  }
  
}
