
WorkingClass = {

	initBindsAll: true,

	init: function( obj, sup ){
			
		if( WorkingClass.initBindsAll ) WorkingClass.bindAll( obj );
	},

	bindAll: function( obj ){

		for( var a in obj ){
			if( a=='bind' ){
				continue;
			}

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
				if( a=='bind' ){
					continue;
				}
			
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

		
		if( !cls.prototype._super ){
			cls.prototype._super = [];
		}
		cls.prototype._super.push( sup );




		cls.prototype.super = function(){

			var f;

			lb:
			for( var j=0; j<this._super.length; j++ ){

				var q = this._super[j];

				var c = arguments.callee.caller;
				var cd = [];
				while( c ){

					if( c == q ){
						r = true;
						break lb;
					}

					if( cd.indexOf( c ) != -1 ){
						break;
					}
					else{
						cd.push( c );
						c = c.caller;
					}
				}

				f = q;
			}

			f.apply( this, arguments );
		};


		for( var name in sup.prototype ){

			var v = sup.prototype[ name ];

			if( typeof( v ) == 'function' ){

				(function( name ){

					cls.prototype.super[ name ] = function(){

						var f;

						lb:
						for( var j=0; j<this._super.length; j++ ){

							var q = this._super[j].prototype[ name ];

							var c = arguments.callee.caller;
							var cd = [];
							while( c ){

								if( c == q ){
									r = true;
									break lb;
								}

								if( cd.indexOf( c ) != -1 ){
									break;
								}
								else{
									cd.push( c );
									c = c.caller;
								}
							}

							f = q;
						}

						return f.apply( this, arguments );
					};

				})( name );
			}
		}
	},

	define: function(){

		var a = 0;

		var cls = arguments[ a++ ];

		if( typeof( arguments[ a ] ) == 'function' ){
			var sup = arguments[ a++ ];
			WorkingClass.extend( cls, sup );
		}

		var fld = arguments[ a++ ];

		for( var n in fld ){
			cls.prototype[ n ] = fld[ n ];
		}

		cls.prototype.workingClass = function(){
			WorkingClass.init( this );
		};

		return cls;
	}

};







