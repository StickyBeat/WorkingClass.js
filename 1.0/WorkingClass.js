
WorkingClass = {

	initBindsAll: true,

	init: function( obj, sup ){
			
		if( WorkingClass.initBindsAll ) WorkingClass.bindAll( obj );

	},

	bindAll: function( obj ){

		for( var a in obj ){
			var b = obj[ a ];
			
			if( typeof( b ) == 'function' ){
				obj[a]=b.bind(obj);
				for( var n in b ){
					obj[a][n]=b[n];
				}
			}
		}

		if( obj.super ){
			for( var a in obj.super ){
				var b = obj.super[ a ];
				if( typeof( b ) == 'function' ){
					obj.super[a]=b.bind(obj);
				}
			}
		}
	},


	extend: function( cls, sup ){

		cls.prototype = Object.create( sup.prototype );
		cls.prototype.constructor = cls;
		cls.prototype.super = function(){
			sup.apply( this, arguments );
		};

		for( var name in sup.prototype ){

			var v = sup.prototype[ name ];

			if( typeof( v ) == 'function' ){

				(function( v ){

					cls.prototype.super[ name ] = function(){

						return v.apply( this, arguments );
					};

				})( v );
			}
		}
	}

};








