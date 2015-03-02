
WorkingClass = {

	init: function( obj ){

		if( obj ){

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
		}
		else{

			WorkingClass.resolveExtensions();
		}
	},


	extend: function( cls, sup ){

		//console.log( cls, sup );

		if( typeof( sup ) == 'string' ){

			if( !WorkingClass.extensions ){
				WorkingClass.extensions = {};
			}

			if( !WorkingClass.extensions[ sup ] ){
				WorkingClass.extensions[ sup ] = [];
			}

			WorkingClass.extensions[ sup ].push( cls );
		}
		else{

			var p = Object.create( cls.prototype );

			cls.prototype = Object.create( sup.prototype );

			for( var name in p ){
				cls.prototype[ name ] = p[ name ];
			}

			cls.prototype.constructor = cls;

			if( sup.prototype._super ){
				cls.prototype._super = sup.prototype._super.concat();
			}
			else{
				cls.prototype._super = [];
			}

			cls.prototype._super.push( sup );


			cls.prototype.super = function(){

				var f;

				for( var j=0; j<this._super.length; j++ ){

					var q = this._super[j];

					if( q == arguments.callee.caller ){
						break;
					}

					f = q;
				}

				f.apply( this, arguments );
			};


			for( var name in sup.prototype ){

				/*
				if( name in cls.prototype ){
					console.log( name + ' is already in proto');
					continue;
				}
				else{
					console.log( name + ' is not in proto' );
				}
				*/

				var v = sup.prototype[ name ];

				if( typeof( v ) == 'function' ){

					(function( name ){

						cls.prototype.super[ name ] = function(){

							var f;

							for( var j=0; j<this._super.length; j++ ){

								var q = this._super[j].prototype[ name ];

								if( q == arguments.callee.caller ){
									break;
								}

								f = q;
							}

							return f.apply( this, arguments );
						};

					})( name );
				}
			}
		}
	},

	define: function(){

		var a = 0;

		var cls = arguments[ a++ ];

		var type = typeof( arguments[ a ] );
		var sup;

		if( type == 'function' || type == 'string' ){
			sup = arguments[ a++ ];
			WorkingClass.extend( cls, sup );
		}

		var fld = arguments[ a++ ];

		if( fld ){
			for( var n in fld ){
				cls.prototype[ n ] = fld[ n ];
			}
		}

		if( !('workingClass' in cls.prototype ) ){
			cls.prototype.workingClass = function(){
				WorkingClass.init( this );
			};
		}

		return cls;
	},

	resolveExtensions: function(){

		if( WorkingClass.resolvedExtensions ){
			return;
		}

		WorkingClass.resolvedExtensions = true;

		if( !WorkingClass.extensions ){
			return;
		}

		var classesByName = {};
		var classNames = [];
		for( var className in WorkingClass.extensions ){
			
			var cls = eval( className );

			if( typeof( cls ) == 'function' ){
				classesByName[ className ] = cls;
				classNames.push( className );
			}
		}

		function isSubclassOf( sub, sup ){

			var subClasses = WorkingClass.extensions[ sup ];
			
			if( !subClasses ){
				return false;
			}

			var cls = classesByName[ sub ];

			return( subClasses.indexOf( cls ) != -1 );
		};

		classNames.sort(function(a,b){

			if( isSubclassOf( a, b ) ){
				return 1;
			}
			else if( isSubclassOf( b, a ) ){
				return -1;
			}
			else{
				return 0;
			}

		});


		for( var n=0; n<classNames.length; n++ ){
			var className = classNames[ n ];
			var sup = classesByName[ className ];
			var subClasses = WorkingClass.extensions[ className ];
			for( var m=0; m<subClasses.length; m++ ){
				var sub = subClasses[ m ];
				WorkingClass.extend( sub, sup );
			}
		}

	}

};







