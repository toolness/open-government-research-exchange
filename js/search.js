$(function() {
    var index, papers, scopes, scopedIndices = {}, resultSnippet;

    var slug = function (t) {
        return t ? t.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        : false ;
    }

    // returns value of key param from location.search, or false
    var getSearch = function(param) {
        var q = location.search.substr(1),
        result = '';

        q.split('&').forEach(function(part) {
            var item = part.split('=');

            if (item[0] == param) {
                result = decodeURIComponent(item[1]);

                if (result.slice(-1) == '/') {
                    result = result.slice(0, -1);
                }
            }
        });
        return result;
    };

    var getx = function (arr, prop, needle) {
        for (var i in arr) {
            if (arr[i][prop] === needle) {
                return arr[i];
            }
        }
    };

    var mapResults = function (fromHaystack, toHaystack, mapFrom, mapTo) {
        var results = [];
        for (var i in fromHaystack) {
            results.push(getx(toHaystack, mapTo, fromHaystack[i][mapFrom]));
        }
        return results;
    }

    // get data //////////////////////////////

    $.get( 'js/searchindex.json', function( d ) {
        index = lunr.Index.load(d.index);
        papers = d.papers;

        $.get( 'rendered_result_item.html', function( d ) {
            resultSnippet = d;

            // after loading the index, grab the search string, if present
            // and inject into the search field and run the search
            var s = getSearch('s').replace('+', ' ');
            if (s) {
                $('#lunr-search').val(s);
                $('#lunr-search').trigger('search:execute');
            }
        })
        .fail(function() {
            console.log ( 'Could not get _rendered_result_item.html!' );
        });

    })
    .fail(function() {
        console.log ( 'Could not get searchindex.json!' );
    });

    $.get( 'js/scopes.json', function( d ) {
        scopes = d;

        for (var s in scopes) {
            scopes[s].custom_filter &&
            getIndex(slug(scopes[s].custom_filter));
        }
    })
    .fail(function() {
        console.log ('Could not get available scopes!');
    });

    var getIndex = function (name) {
        $.get( 'js/searchindex-' + name + '.json', function( d ) {
            scopedIndices[name] = lunr.Index.load(d.index);
        })
        .fail(function() {
            console.log('Could not $.get scoped index : ' + name);
        });
    }

    //////////////////////////////////////////

    var search = function (e) {
        var mapping = mapResults(index.search($(this).val()), papers, 'ref', 'id'), resultsHTML = '';



        for (var m in mapping) {
            // inject the result snippet with the mapped data
            var $snippet = $(resultSnippet);
            var _html;

            $snippet.find('.e-result-name').html(
                '<a href="' +
                mapping[m].id + '-' + slug(mapping[m].title)
                + '.html" title="' +
                mapping[m].title
                + '">' + mapping[m].title
                + '</a>'
                );

            _html = '';
            for (var i in mapping[m].authors) {
                _html +=
                '<a class="e-author-link" href="#">' +
                mapping[m].authors[i]
                + '</a>' +
                (i < mapping[m].authors.length-1 ? ', ' : '')
                ;
            }

            $snippet.find('.e-result-authors').html(_html);

            _html = '<p>Category</p>';
            for (var i in mapping[m].taxonomy.category) {
                _html +=
                '<a class="e-tag m-' +
                slug(mapping[m].taxonomy.category[i])
                + '" href="#">' +
                mapping[m].taxonomy.category[i]
                + '</a> '
                ;
            }

            $snippet.find('.e-result-taxonomy.m-category').html(_html);

            _html = '<p>Methodology</p>';
            for (var i in mapping[m].taxonomy.methodology) {
                _html +=
                '<a class="e-tag m-' +
                slug(mapping[m].taxonomy.methodology[i])
                + '" href="#">' +
                mapping[m].taxonomy.methodology[i]
                + '</a> '
                ;
            }

            $snippet.find('.e-result-taxonomy.m-methodology').html(_html);

            _html = '<p>Objective</p>';
            for (var i in mapping[m].taxonomy.objective) {
                _html +=
                '<a class="e-tag m-' +
                slug(mapping[m].taxonomy.objective[i])
                + '" href="#">' +
                mapping[m].taxonomy.objective[i]
                + '</a> '
                ;
            }

            $snippet.find('.e-result-taxonomy.m-objective').html(_html);

            $snippet.find('.m-type').html(
                '<p>Type</p><a class="e-tag" href="#">' +
                mapping[m].type
                + '</a>'
                );

            _html = '<p>Region</p>';
            for (var i in mapping[m].region) {
                _html +=
                '<a class="e-tag m-' +
                slug(mapping[m].region[i])
                + '" href="#">' +
                mapping[m].region[i]
                + '</a> '
                ;
            }

            $snippet.find('.m-region').html(_html);

            _html = '<p>Sector</p>';
            for (var i in mapping[m].sector) {
                _html +=
                '<a class="e-tag m-' +
                slug(mapping[m].sector[i])
                + '" href="#">' +
                mapping[m].sector[i]
                + '</a> '
                ;
            }

            $snippet.find('.m-sector').html(_html);

            _html = '<p>Tools</p>';
            for (var i in mapping[m].tools) {
                _html +=
                '<a class="e-tag m-' +
                slug(mapping[m].tools[i])
                + '" href="#">' +
                mapping[m].tools[i]
                + '</a> '
                ;
            }

            $snippet.find('.m-tools').html(_html);

            $snippet.find('.m-closed-access').remove();

            if (mapping[m].access.toLowerCase() === 'closed') {
             $snippet.find('.e-result-extras').append('<i class="material-icons m-closed-access" title="Closed Access">lock_outline</i>')
         }

         resultsHTML += $snippet.prop('outerHTML');
     }

     $( '.b-lunr-results' ).html(resultsHTML);
 };

 var filter = function (e) {
        // $( '.b-lunr-results' ).text( JSON.stringify(index.search($('#lunr-search').val())) );

        var results,
        limit = 50;

        if ($(this).attr('data-category') && $(this).attr('data-category') !== 'false') {
            results = scopedIndices[$(this).attr('data-category')].search($(this).val());
        } else {
            results = index.search($(this).val());
        }

        // console.log ($(this).attr('data-category'), $(this).val(), results, scopedIndices[$(this).attr('data-category')]);

        if (results.length > limit) {
            results = results.slice(0, limit);
        }

        $( document ).trigger( 'filter:removeClassesContaining', [ 'f-search-' ] );

        for (var r in results) {
            if (r == 0) {
                $( document ).trigger( 'filter:add', [ '.f-search-' + results[r].ref ] );
            } else {
                $( document ).trigger( 'filter:addOR', [ '.f-search-' + results[r].ref ] );
            }
        }

        $( document ).trigger( 'filter:update' );

    }

    var debouncedSearch = _.debounce(search, 300, false);
    var debouncedFilter = _.debounce(filter, 500, false);

    $('#lunr-search').keyup(debouncedSearch);
    $('#lunr-search').on('search:execute', debouncedSearch);
    $('#lunr-filter').keyup(debouncedFilter);

    // prevent enter key from submitting form
    $('.lunr-form').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });

});