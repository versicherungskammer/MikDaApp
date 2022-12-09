  <template>
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 600px">
    
        
  
        <q-input rounded outlined v-model="kilometer" v-on:change="convertMile" label="Distance in Kilometer" />
        <q-input rounded outlined v-model="mile" v-on:change="convertKilometer" label="Distance in Mile" />
        
      </div>
    </div>
  </template>
  
  <script setup>

    import { ref } from 'vue'
    const kilometer = ref(0);
    const mile = ref(0);  
    const convertMile=()=>{
        mile.value = kilometer.value*0.62137;

    }
    const convertKilometer=()=>{
        kilometer.value = mile.value/0.62137;

    }
    

  
 
  </script>
  
  