// Used for creating lists of tags from taginfo.
// See https://wiki.openstreetmap.org/wiki/Taginfo/Taglists
var taginfo_taglist = (function(){

    function html_escape(text) {
        return String(text).
                replace(/&/g, '&amp;').
                replace(/</g, '&lt;').
                replace(/>/g, '&gt;').
                replace(/"/g, '&quot;').
                replace(/'/g, '&#39;');
    }

    function link_to_noescape(url, text) {
        return '<a href="' + url + '">' + text + '</a>';
    }

    function link_to(url, text) {
        return link_to_noescape(url, html_escape(text));
    }

    function url_for_wiki(title) {
        var path = 'https://wiki.openstreetmap.org/wiki/';
        return path + encodeURIComponent(title);
    }

    function url_for_taginfo(path) {
        return 'https://taginfo.openstreetmap.org/' + path;
    }

    function taginfo_key_link(key) {
        return link_to(url_for_taginfo('keys/?') +
                       jQuery.param({ 'key': key }), key);
    }

    function taginfo_tag_link(key, value) {
        return link_to(url_for_taginfo('tags/?') +
                       jQuery.param({ 'key': key, 'value': value }), value);
    }

    function type_image(type) {
        return '<img src="' +
                 url_for_taginfo('img/types/' + type + '.svg') +
                 '" width="16" height="16"/> ';
    }

    function wiki_prefix(lang, type) {
        if (lang === 'en') {
            return type + ':';
        }
        return lang + ':' + type + ':';
    }

    function wiki_key_link(lang, key) {
        return link_to(url_for_wiki(wiki_prefix(lang, 'Key') + key), key);
    }

    function wiki_tag_link(lang, key, value) {
        return link_to(url_for_wiki(wiki_prefix(lang, 'Tag') + key + '=' + value), value);
    }

    function column_name(lang, column) {
        var names = {
            'cs': {
                'key': 'Klíč',
                'value': 'Hodnota',
                'element': 'Prvek',
                'description': 'Popis',
                'image': 'Ilustrace',
                'count': 'Počet'
            },
            'de': {
                'key': 'Key',
                'value': 'Value',
                'element': 'Element',
                'description': 'Beschreibung',
                'image': 'Bild',
                'count': 'Anzahl'
            },
            'en': {
                'key': 'Key',
                'value': 'Value',
                'element': 'Element',
                'description': 'Description',
                'image': 'Image',
                'count': 'Count'
            },
            'es': {
                'key': 'Clave',
                'value': 'Valor',
                'element': 'Tipo',
                'description': 'Descripción',
                'image': 'Imagen',
                'count': 'Recuento'
            },
            'fr': {
                'key': 'Clé',
                'value': 'Valeur',
                'element': '',
                'description': 'Description',
                'image': 'Image',
                'count': 'Count'
            },
            'hu': {
                'key': 'Kulcs',
                'value': 'Érték',
                'element': 'Típus',
                'description': 'Leírás',
                'image': 'Kép',
                'count': 'Darab'
            },
            'it': {
                'key': 'Chiave',
                'value': 'Valore',
                'element': 'Tipo Oggetto',
                'description': 'Descrizione',
                'image': 'Immagine',
                'count': 'Conteggio'
            },
            'ja': {
                'key': 'キー',
                'value': '値',
                'element': '種別',
                'description': '説明',
                'image': '画像',
                'count': '件数'
            },
            'pl': {
                'key': 'Klucz',
                'value': 'Wartość',
                'element': 'Rodzaj',
                'description': 'Opis',
                'image': 'Obraz',
                'count': 'Ilość'
            },
            'pt': {
                'key': 'Chave',
                'value': 'Valor',
                'element': 'Tipo',
                'description': 'Descrição',
                'image': 'Imagem',
                'count': 'Contagem'
            },
            'ru': {
                'key': 'Ключ',
                'value': 'Значение',
                'element': 'Тип',
                'description': 'Описание',
                'image': 'Изображение',
                'count': 'Количество'
            },
            'uk': {
                'key': 'Ключ',
                'value': 'Значення',
                'element': 'Тип',
                'description': 'Опис',
                'image': 'Зображення',
                'count': 'Кількість'
            },
            'vi': {
                'key': 'Chìa khóa',
                'value': 'Giá trị',
                'element': 'Kiểu',
                'description': 'Miêu tả',
                'image': 'Hình ảnh',
                'count': 'Tổng số'
            },
            'zh-TW': {
                'key': '鍵',
                'value': '值',
                'element': '類型',
                'description': '描述',
                'image': '圖片',
                'count': '計數'
            }
        };

        if (!names[lang]) {
            lang = 'en';
        }

        return names[lang][column];
    }

    function get_lang(data, lang) {
        if (data.wiki && data.wiki[lang]) {
            return lang;
        }
        return 'en';
    }

    var print_column = {
        'key': function(lang, data) {
            return wiki_key_link(get_lang(data, lang), data.key);
        },
        'value': function(lang, data) {
            return wiki_tag_link(get_lang(data, lang), data.key, data.value);
        },
        'element': function(lang, data) {
            var types = '';
            if (data.on_node)     { types += type_image('node');     }
            if (data.on_way)      { types += type_image('way');      }
            if (data.on_area)     { types += type_image('area');     }
            if (data.on_relation) { types += type_image('relation'); }
            return types;
        },
        'description': function(lang, data) {
            if (data.wiki) {
                var d = data.wiki[lang] || data.wiki['en'];
                if (d && d.description) {
                    return html_escape(d.description);
                }
            }
            return "";
        },
        'image': function(lang, data) {
            if (data.wiki) {
                var d = data.wiki[lang] || data.wiki['en'];
                if (d && d.image) {
                    return link_to_noescape(url_for_wiki(d.image.image),
                                            '<img src="' + d.image.thumb_url_prefix + '100' + d.image.thumb_url_suffix + '"/>');
                }
            }
            return "";
        },
        'count': function(lang, data) {
            return ['node', 'way', 'relation'].map(function(type) {
                var value = data['count_' + type + 's'].toString().
                            replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1&thinsp;');
                return '<div style="text-align: right">' +
                       value + ' ' + type_image(type) + '</div>';
            }).join('');
        }
    };

    function td(content) { return '<td>' + content + '</td>'; }
    function th(content) { return '<th>' + content + '</th>'; }
    function tr(content) { return '<tr>' + content + '</tr>'; }

    function create_table(data, options) {
        var columns = ['key', 'value', 'element', 'description', 'image'];

        if (options.with_count) {
            columns.push('count');
        }

        return '<table class="taginfo-taglist"><thead><tr>' +
            columns.map(function(column) {
                return th(column_name(options.lang, column));
            }).join('') + '</tr></thead><tbody>' +
            data.map(function(d) {
                return tr(columns.map(function(column) {
                    return td(print_column[column](options.lang, d));
                }).join(''));
            }).join('') + '</tbody></table>';
    }

    function insert_table(element, tags, options) {
        var url = url_for_taginfo('api/4/tags/list?');

        if (! options.lang) {
            options.lang = 'en';
        }

        if (tags.match(/=/)) {
            url += 'tags=' + encodeURIComponent(tags);
        } else {
            url += 'key=' + encodeURIComponent(tags);
        }

        jQuery.getJSON(url, function(json) {
            element.html(create_table(json.data, options));
        });
    }

    return {

        show_table: function(element, tags, options) {
            if (typeof(element) === 'string') {
                element = jQuery(element);
            }
            insert_table(element, tags, options);
        },

        convert_to_taglist: function(elements) {
            if (typeof(elements) === 'string') {
                elements = jQuery(elements);
            }
            elements.each(function() {
                var element = jQuery(this),
                    tags = element.data("taginfo-taglist-tags"),
                    options = element.data("taginfo-taglist-options");

                if (typeof(options) !== 'object') {
                    options = {};
                }

                insert_table(element, tags, options);
            });
        }

    };

})();

