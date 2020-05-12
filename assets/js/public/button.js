// Add to wishlist
(function ($) {

	//Add to wishlist main function.
	$.fn.tinvwl_to_wishlist = function (so) {
		var sd = {
			api_url: window.location.href.split('?')[0],
			text_create: window.tinvwl_add_to_wishlist['text_create'],
			text_already_in: window.tinvwl_add_to_wishlist['text_already_in'],
			class: {
				dialogbox: '.tinvwl_add_to_select_wishlist',
				select: '.tinvwl_wishlist',
				newtitle: '.tinvwl_new_input',
				dialogbutton: '.tinvwl_button_add'
			},
			redirectTimer: null,
			onPrepareList: function () {
			},
			onGetDialogBox: function () {
			},
			onPrepareDialogBox: function () {
				if (!$('body > .tinv-wishlist').length) {
					$('body').append($('<div>').addClass('tinv-wishlist'));
				}
				$(this).appendTo('body > .tinv-wishlist');
			},
			onCreateWishList: function (wishlist) {
				$(this).append($('<option>').html(wishlist.title).val(wishlist.ID).toggleClass('tinv_in_wishlist', wishlist.in));
			},
			onSelectWishList: function () {
			},
			onDialogShow: function (modal) {
				$(modal).addClass('tinv-modal-open');
				$(modal).removeClass('ftinvwl-pulse');
			},
			onDialogHide: function (modal) {
				$(modal).removeClass('tinv-modal-open');
				$(modal).removeClass('ftinvwl-pulse');
			},
			onInited: function () {
			},
			onClick: function () {
				if ($(this).is('.disabled-add-wishlist')) {
					return false;
				}
				if ($(this).is('.ftinvwl-animated')) {
					$(this).addClass('ftinvwl-pulse');
				}
				if (this.tinvwl_dialog) {
					this.tinvwl_dialog.show_list.call(this);
				} else {
					s.onActionProduct.call(this);
				}
			},
			onPrepareDataAction: function (a, data) {
				$('body').trigger('tinvwl_wishlist_button_clicked', [a, data]);

			},
			filterProductAlreadyIn: function (WList) {
				var WList = WList || [],
					data = {};
				$('form.cart[method=post], .woocommerce-variation-add-to-cart, form.vtajaxform[method=post]').find('input, select').each(function () {
					var name_elm = $(this).attr('name'),
						type_elm = $(this).attr('type'),
						value_elm = $(this).val();
					if ('checkbox' === type_elm || 'radio' === type_elm) {
						if ($(this).is(':checked')) {
							data['form' + name_elm] = value_elm;
						}
					} else {
						data['form' + name_elm] = value_elm;
					}
				});
				data = data['formvariation_id'];
				return WList.filter(function (wishlist) {
					if ('object' === typeof wishlist.in && 'string' === typeof data) {
						var number = parseInt(data);
						return 0 <= wishlist.in.indexOf(number);
					}
					return wishlist.in;
				});
			},
			onMultiProductAlreadyIn: function (WList) {
				var WList = WList || [];
				WList = s.onPrepareList.call(WList) || WList;
				WList = s.filterProductAlreadyIn.call(this, WList) || WList;
				$(this).parent().parent().find('.already-in').remove();
				var text = '';
				switch (WList.length) {
					case 0:
						break;
					default:
						var text = $('<ul>');
						$.each(WList, function (k, wishlist) {
							text.append($('<li>').html($('<a>').html(wishlist.title).attr({
								href: wishlist.url
							})).val(wishlist.ID));
						});
						break;
				}
				if (text.length) {
					$(this).closest('.tinv-modal-inner').find('img').after($('<div>').addClass('already-in').html(s.text_already_in + ' ').append(text));
				}
			},
			onAction: {
				redirect: function (url) {
					if (s.redirectTimer) {
						clearTimeout(s.redirectTimer);
					}
					s.redirectTimer = window.setTimeout(function () {
						window.location.href = url;
					}, 4000);
				},
				force_redirect: function (url) {
					window.location.href = url;
				},
				wishlists: function (wishlist) {
					var i = $(this).data('tinv-wl-product'),
						e = $("a.tinvwl_add_to_wishlist_button[data-tinv-wl-product='" + i + "']");
					e.each(function () {
						$(this).attr('data-tinv-wl-list', wishlist);
					});
				},
				msg: function (html) {
					if (!html) {
						return false;
					}
					var $msg = $(html).eq(0);
					if (!$('body > .tinv-wishlist').length) {
						$('body').append($('<div>').addClass('tinv-wishlist'));
					}
					$('body > .tinv-wishlist').append($msg);
					$msg.on('click', '.tinv-close-modal, .tinvwl_button_close, .tinv-overlay', function (e) {
						e.preventDefault();
						$msg.remove();
						if (s.redirectTimer) {
							clearTimeout(s.redirectTimer);
						}
					});
				},
				status: function (status) {
					$('body').trigger('tinvwl_wishlist_added_status', [this, status]);
					if (status) {
						var i = $(this).data('tinv-wl-product'),
							e = $("a.tinvwl_add_to_wishlist_button[data-tinv-wl-product='" + i + "']");
						e.each(function () {
							$(this).addClass('tinvwl-product-in-list');
						});
					}
				},
				removed: function (status) {
					if (status) {
						var i = $(this).data('tinv-wl-product'),
							e = $("a.tinvwl_add_to_wishlist_button[data-tinv-wl-product='" + i + "']");
						e.each(function () {
							$(this).removeClass('tinvwl-product-in-list').removeClass('tinvwl-product-make-remove').attr('data-tinv-wl-action', 'addto');
						});
					}
				},
				make_remove: function (status) {
					if (status) {
						var i = $(this).data('tinv-wl-product'),
							e = $("a.tinvwl_add_to_wishlist_button[data-tinv-wl-product='" + i + "']");
						e.each(function () {
							$(this).toggleClass('tinvwl-product-make-remove', status).attr('data-tinv-wl-action', status ? 'remove' : 'addto');
						});
					}
				},
				counter: function (value) {
					var has_products = !('0' == value || '' == value);
					$('.wishlist_products_counter').toggleClass('wishlist-counter-with-products', has_products);
					set_hash(value);
				}
			}
		};
		sd.onActionProduct = function (id, name) {
			var data = {
					form: {},
					tinv_wishlist_id: id || '',
					tinv_wishlist_name: name || '',
					product_type: $(this).attr('data-tinv-wl-producttype'),
					product_id: $(this).attr('data-tinv-wl-product') || 0,
					product_variation: $(this).attr('data-tinv-wl-productvariation') || 0,
					product_action: $(this).attr('data-tinv-wl-action') || 'addto',
					redirect: window.location.href
				},
				a = this;
			$(a).closest('form.cart[method=post], form.vtajaxform[method=post], .tinvwl-loop-button-wrapper').find('input:not(:disabled), select:not(:disabled), textarea:not(:disabled)').each(function () {
				var name_elm = $(this).attr('name'),
					type_elm = $(this).attr('type'),
					value_elm = $(this).val(),
					count = 10,
					ti_merge_value = function (o1, o2) {
						if ('object' === typeof o2) {
							if ('undefined' === typeof o1) {
								o1 = {};
							}
							for (var i in o2) {
								if ('' === i) {
									var j = -1;
									for (j in o1) {
										j = j;
									}
									j = parseInt(j) + 1;
									o1[j] = ti_merge_value(o1[i], o2[i]);
								} else {
									o1[i] = ti_merge_value(o1[i], o2[i]);
								}
							}
							return o1;
						} else {
							return o2;
						}
					};
				if ('button' === type_elm || 'undefined' == typeof name_elm) {
					return;
				}
				while (/^(.+)\[([^\[\]]*?)\]$/.test(name_elm) && 0 < count) {
					var n_name = name_elm.match(/^(.+)\[([^\[\]]*?)\]$/);
					if (3 === n_name.length) {
						var _value_elm = {};
						_value_elm[n_name[2]] = value_elm;
						value_elm = _value_elm;
					}
					name_elm = n_name[1];
					count--;
				}
				if ('checkbox' === type_elm || 'radio' === type_elm) {
					if ($(this).is(':checked')) {
						if (!value_elm.length && 'object' !== typeof value_elm) {
							value_elm = true;
						}
						data.form[name_elm] = ti_merge_value(data.form[name_elm], value_elm);
					}
				} else {
					data.form[name_elm] = ti_merge_value(data.form[name_elm], value_elm);
				}
			});
			data = s.onPrepareDataAction.call(a, a, data) || data;

			$.post(s.api_url, data, function (body) {
				s.onDialogHide.call(a.tinvwl_dialog, a);
				if ('object' === typeof body) {
					for (var k in body) {
						if ('function' === typeof s.onAction[k]) {
							s.onAction[k].call(a, body[k]);
						}
					}
				} else {
					if ('function' === typeof s.onAction['msg']) {
						s.onAction['msg'].call(a, body);
					}
				}
			});
		};
		var s = $.extend(true, {}, sd, so);
		return $(this).each(function () {
			if (!$(this).attr('data-tinv-wl-list')) {
				return false;
			}
			if (s.dialogbox) {
				if (s.dialogbox.length) {
					this.tinvwl_dialog = s.dialogbox;
				}
			}
			if (!this.tinvwl_dialog) {
				this.tinvwl_dialog = s.onGetDialogBox.call(this);
			}
			if (!this.tinvwl_dialog) {
				var _tinvwl_dialog = $(this).nextAll(s.class.dialogbox).eq(0);
				if (_tinvwl_dialog.length) {
					this.tinvwl_dialog = _tinvwl_dialog;
				}
			}
			if (this.tinvwl_dialog) {
				s.onPrepareDialogBox.call(this.tinvwl_dialog);
				if ('function' !== typeof this.tinvwl_dialog.update_list) {
					this.tinvwl_dialog.update_list = function (WL) {
						var $select = $(this).find(s.class.select).eq(0);
						$(this).find(s.class.newtitle).hide().val('');
						$select.html('');
						$.each(WL, function (k, v) {
							s.onCreateWishList.call($select, v);
						});
						if (s.text_create) {
							s.onCreateWishList.call($select, {
								ID: '',
								title: s.text_create,
								in: false
							});
						}
						s.onMultiProductAlreadyIn.call($select, WL);
						s.onSelectWishList.call($select, WL);
						$(this).find(s.class.newtitle).toggle('' === $select.val());
					}
				}
				if ('function' !== typeof this.tinvwl_dialog.show_list) {
					this.tinvwl_dialog.show_list = function () {
						var WList = $.parseJSON($(this).attr('data-tinv-wl-list')) || [];
						if (WList.length) {
							WList = s.onPrepareList.call(WList) || WList;
							this.tinvwl_dialog.update_list(WList);
							s.onDialogShow.call(this.tinvwl_dialog, this);
						} else {
							s.onActionProduct.call(this);
						}
					}
				}
				var a = this;
				$(this.tinvwl_dialog).find(s.class.dialogbutton).off('click').on('click', function () {
					var b = $(a.tinvwl_dialog).find(s.class.select),
						c = $(a.tinvwl_dialog).find(s.class.newtitle),
						d;
					if (b.val() || c.val()) {
						s.onActionProduct.call(a, b.val(), c.val());
					} else {
						d = c.is(':visible') ? c : b;
						d.addClass('empty-name-wishlist');
						window.setTimeout(function () {
							d.removeClass('empty-name-wishlist');
						}, 1000);
					}
				});
			}
			$(this).off('click').on('click', s.onClick);
			s.onInited.call(this, s);
		});
	};

	$(document).ready(function () {

		// Add to wishlist button click
		$('body').on('click', '.tinvwl_add_to_wishlist_button', function (e) {
			if ($(this).is('.disabled-add-wishlist')) {
				e.preventDefault();
				window.alert(tinvwl_add_to_wishlist.i18n_make_a_selection_text);
				return;
			}
			if ($(this).is('.inited-add-wishlist')) {
				return;
			}
			$(this).tinvwl_to_wishlist({
				onInited: function (s) {
					$(this).addClass('inited-add-wishlist');
					s.onClick.call(this);
				}
			});
		});

		// Disable add to wishlist button if variations not selected
		$(document).on('hide_variation', '.variations_form', function (a) {
			var e = $(this).find('.tinvwl_add_to_wishlist_button');
			if (e.length && !tinvwl_add_to_wishlist.allow_parent_variable) {
				a.preventDefault();
				e.addClass('disabled-add-wishlist');
			}
		});

		$(document).on('show_variation', '.variations_form', function (a, b, d) {
			var e = $(this).find('.tinvwl_add_to_wishlist_button');
			if (e.length && e.attr('data-tinv-wl-list')) {
				var f = JSON.parse(e.attr('data-tinv-wl-list')),
					j = false,
					g = '1' == window.tinvwl_add_to_wishlist['simple_flow'];
				for (var i in f) {
					if (f[i].hasOwnProperty('in') && Array.isArray(f[i]['in']) && -1 < (f[i]['in'] || []).indexOf(b.variation_id)) {
						j = true;
					}
				}
				e.toggleClass('tinvwl-product-in-list', j).toggleClass('tinvwl-product-make-remove', (j && g)).attr('data-tinv-wl-action', ((j && g) ? 'remove' : 'addto'));
			}
			a.preventDefault();
			e.removeClass('disabled-add-wishlist');
		});

		// Refresh when storage changes in another tab
		$(window).on('storage onstorage', function (e) {
			if (
				hash_key === e.originalEvent.key && localStorage.getItem(hash_key) !== sessionStorage.getItem(hash_key)
			) {
				set_hash(localStorage.getItem(hash_key));
			}
		});


		var addParams = function (url, data) {
			if (!$.isEmptyObject(data)) {
				url += (url.indexOf('?') >= 0 ? '&' : '?') + $.param(data);
			}

			return url;
		}

		// Get wishlist data from REST API.
		var tinvwl_products = [], tinvwl_counter = false;
		$('a.tinvwl_add_to_wishlist_button').each(function () {
			if ($(this).data('tinv-wl-product') !== 'undefined' && $(this).data('tinv-wl-product')) {
				tinvwl_products.push($(this).data('tinv-wl-product'));
			}
		});

		$('.wishlist_products_counter_number').each(function () {
			tinvwl_counter = true;
		});

		var rest_request = function () {

			if (tinvwl_products.length || tinvwl_counter) {
				var params = {
					'ids': tinvwl_products,
					'counter': tinvwl_counter,
				};

				if (tinvwl_add_to_wishlist.wpml) {
					params['lang'] = tinvwl_add_to_wishlist.wpml;
				}

				var endpoint = addParams(tinvwl_add_to_wishlist.rest_root + 'wishlist/v1/products', params);

				$.ajax({
					url: endpoint,
					method: 'GET',
					beforeSend: function (xhr) {
						xhr.setRequestHeader('X-WP-Nonce', tinvwl_add_to_wishlist.nonce);
					},
				}).done(function (response) {

					var has_products = !('0' == response.counter || '' == response.counter);
					$('.wishlist_products_counter').toggleClass('wishlist-counter-with-products', has_products);
					set_hash(response.counter);

					$.each(response.products, function (i, item) {
						var j = false,
							g = '1' == window.tinvwl_add_to_wishlist['simple_flow'],
							e = $("a.tinvwl_add_to_wishlist_button[data-tinv-wl-product='" + i + "']");
						for (var i in item) {
							if (item[i].hasOwnProperty('in') && Array.isArray(item[i]['in'])) {
								j = true;
							}
						}
						e.each(function () {
							$(this).removeClass('tinvwl-add-hide').attr('data-tinv-wl-list', JSON.stringify(item)).toggleClass('tinvwl-product-in-list', j).toggleClass('tinvwl-product-make-remove', (j && g)).attr('data-tinv-wl-action', ((j && g) ? 'remove' : 'addto'));
						});
					})
				});
			}
		}

		rest_request();

		/* Dynamic buttons */
		// Create an observer instance
		var observer = new MutationObserver(function (mutations) {
			tinvwl_products = [];
			mutations.forEach(function (mutation) {
				var newNodes = mutation.addedNodes;
				// If there are new nodes added
				if (newNodes !== null) {
					var $nodes = $(newNodes);
					$nodes.each(function () {
						var $node = $(this),
							els = $node.find(".tinvwl_add_to_wishlist_button");
						if (els.length) {
							els.each(function () {
								if ($(this).data('tinv-wl-product') !== 'undefined' && $(this).data('tinv-wl-product')) {
									tinvwl_products.push($(this).data('tinv-wl-product'));
								}
							});
						}
					});
				}
			});
			if (tinvwl_products.length) {
				rest_request();
			}
		});
		// Configuration of the observer:
		var config = {
			childList: true,
			subtree: true
		};
		var targetNode = document.body;
		observer.observe(targetNode, config);
	});


	/* Storage Handling */
	var $supports_html5_storage = true,
		hash_key = tinvwl_add_to_wishlist.hash_key;

	try {
		$supports_html5_storage = ('sessionStorage' in window && window.sessionStorage !== null);
		window.sessionStorage.setItem('ti', 'test');
		window.sessionStorage.removeItem('ti');
		window.localStorage.setItem('ti', 'test');
		window.localStorage.removeItem('ti');
	} catch (err) {
		$supports_html5_storage = false;
	}

	/** Set the  hash in both session and local storage */
	function set_hash(hash) {
		if ($supports_html5_storage) {
			localStorage.setItem(hash_key, hash);
			sessionStorage.setItem(hash_key, hash);

			if ('false' !== hash) {
				jQuery('.wishlist_products_counter_number, body.theme-woostify .wishlist-item-count').html(hash);
			} else {
				jQuery('.wishlist_products_counter_number, body.theme-woostify .wishlist-item-count').html('').closest('span.wishlist-counter-with-products').removeClass('wishlist-counter-with-products');
			}

			var has_products = !('0' == hash || 'false' == hash);
			jQuery('.wishlist_products_counter').toggleClass('wishlist-counter-with-products', has_products);
		}
	}
})(jQuery);
