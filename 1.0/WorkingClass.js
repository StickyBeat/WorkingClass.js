
WorkingClass = {

	initBindsAll: true,
	initSynthesizes: true,

	init: function( obj, sup ){
			
		if( WorkingClass.initBindsAll ) WorkingClass.bindAll( obj );
		if( WorkingClass.initSynthesizes ) WorkingClass.synthesize( obj );

	},

	bindAll: function( obj ){

		for( var a in obj ){
			var b = obj[ a ];
			if( typeof( b ) == 'function' ){
				obj[a]=b.bind(obj);
			}
		}
	},

	synthesize: function( obj ){

		for( var a in obj ){
			var b = obj[ a ];
			if( typeof( b ) != 'function' ){
				var c = a.substr(0,1).toUpperCase() + a.substr(1);
				var g = 'get'+c;
				if( !obj[g] ) obj[g]=function(){ return this.a[ this.b ] }.bind({a:obj,b:a});
				var s = 'set'+c;
				if( !obj[s] ) obj[s]=function(v){ return this.a[ this.b ] = v; }.bind({a:obj,b:a});
			}
		}
	}

};








