/**
 * PopUp class
 *
 * Parameters for body, tag attribute (auto load popup):
 * data-nep-popup-show : "true" //Trigger for click show popup
 * clickClassPopaps : 'nep-popup-call', //Class on click show Popup
 *
 * Parameters for click element, tag attribute:
 * data-nep-popup-show : "true" //Trigger data-nep-popup-show="true" for click show popup
 * clickClassPopaps : 'nep-popup-call', //Class class="nep-popup-call" on click show Popup
 * data-nep-ajax-wpaction: 'wpaction', //Set wpaction for Ajax request
 * clickUrlPopaps : '#showpopup', //Puth in url http://www.site.com/#showpopup on click show Popup
 *
 * data-nep-popup-innercontent : "src|href" //Get inner content from attr (src, href)
 * data-nep-popup-idcontent : "id-element" //Get content from element id
 * data-nep-ajax-wpaction: "wpaction" //Get content Ajax from WordPress
 * data-nep-content-ajax : "url|parameters" //Get content from ajax (Relative URL with parameters OR parameters (json|get))
 *
 * data-npwd-background="rgba(40, 40, 40, 0.75)" //Custom wrapper  styles (npwd = wrapper desctop, npwt = wrapper tablet, npwm = wrapper mobile)
 * data-npbd-max-width="300px" //Custom content block styles (npbd = content desctop, npbt = content tablet, npbm = content mobile)
 * data-npcd-max-width="10px" //Custom close button styles (npcd = button desctop, npct = button tablet, npcm = button mobile)
 * data-nppd-display="none !important" //Custom preloader icon styles (nppd = icon desctop, nppt = icon tablet, nppm = icon mobile)
 * @author Oleg Medinskiy
 */


class nepPopUps{

    constructor(props){

        let defaultConfig = {
            clickbyAttribute: 'data-nep-popup-show', //If is attribue exist in <body> - PopUp automatikaly show on load page (data-nep-popup-show="true")
            clickClassPopaps: 'nep-popup-call', //Class on click show Popup (class="nep-popup-call")
            clickUrlPopaps: '#all_in_one_section', //Puth in URL on click show Popup (href="http://www.site.ru/#all_in_one_section")

            innerContentAttribute: 'data-nep-popup-innercontent', //Ajax content for call
            idContentElement: 'data-nep-popup-idcontent', //Ajax content for call
            ajaxContentAttribute: 'data-nep-content-ajax', //Ajax content for call (url|parameters)
            ajaxContentAction: 'data-nep-ajax-wpaction', //Ajax action for WordPress

            customPopupClass: 'data-nep-cust-pclass', //Set custom class of Popup


            "popups" : [], //Popups called ids

            "postid" : '',

            popup_config : {
                //up_load_delay: "500",  //Delay popup show on load page
                tablet_trig : "1200px", //Tablet display width
                mobile_trig : "768px",   //Mobile display width

                prel_size : "22",   //Preloader icon size
                prel_bsize : "4",   //Preloader icon border size
                prel_color : "rgba(255,255,255,0.4)"   //Preloader icon color
            },

            desctop : {
                //Wrapper styles
                //"wrap_background": "rgba(0,0,0,0.8)", //Background wrapper
                "wrap_background": "rgba(40, 40, 40, 0.75)", //Background wrapper
                "wrap_transition": "opacity 0.2s ease-in", //Background wrapper
                "wrap_padding": "0", //Padding wrapper

                //Content block
                "block_background": "#fff", //Background popup block
                "block_border": "3px solid #0082c8", //Border popup block, full
                "block_border-radius": "0", //Border popup block, full
                "block_box-shadow": "0 0 15px rgba(0,0,0,0.22)", //Shadow popup block, full
                "block_padding": "0", //Padding popup block
                "block_width": "100vw", //Width popup block default (desctop)
                "block_max-width": "960px", //Width popup block default (desctop)
                "block_height": "auto", //Height popup block default (desctop)
                "block_min-height": "60px", //Height popup block default (desctop)
                //"block_max-height": "96vh", //Height popup block default (desctop)
                "block_justify-content": "center", //Height popup block default (desctop):;
                "block_align-items": "center", //Height popup block default (desctop):;
                "block_margin-top": "20px", //Margin popup block
                "block_margin-bottom": "20px", //Margin popup block

                //Close button
                "close_width": "30px !important", //Width button
                "close_height": "30px !important", //Height button
                "close_line-height": "30px !important", //Line-height button
                "close_top": "0 !important", //Margin top button
                "close_right": "0 !important", //Margin right button
                "close_font-size": "26px !important", //Size X simbol close button
                "close_color": "#000 !important", //Color X simbol close button
                "close_background": "#d7d7d7 !important", //Color X simbol close button
                "close_border": "0 !important", //Color X simbol close button
                "close_border-radius": "0 !important", //Color X simbol close button
                "close_font-weight": "400 !important", //Color X simbol close button

                "hclose_color": "red !important", //Color hover X simbol close button
            },

            tablet : {
                "block_width" : "94vw", //Width popup block for tablet
                "block_padding": "0", //Padding popup block
                "block_margin-top": "20px", //Margin popup block
                "block_margin-bottom": "20px", //Margin popup block
            },

            mobile : {
                "block_width" : "100vw", //Width popup block for mobile
            },

        }
        this.config = Object.assign(defaultConfig, props);

        this._oldConf = JSON.parse(JSON.stringify(this.config));
        this.popups = [];

        this.init();
    }


    init(){
        //Call events metod
        this.eventsFeeler(this.config);
    }



    _makeCssStyles(id_el, id_html){
        if( !id_el || !id_html ) return;

        let popup_styles = '.nep-popup-content{display:none;}';

        //Wrapper styles
        popup_styles += ' #' + id_html + '.nep-popup-wrap{cursor:pointer;max-width:100%;position:fixed;z-index:-1;opacity:0;top:0;left:0;width:100vw;height:100vh;overflow-y:auto;box-sizing:border-box;display:flex;flex-flow:column nowrap;justify-content:center;';
        popup_styles += this._make_css_rules('desctop', 'wrap_');
        popup_styles += '}';


        //Preloader
        popup_styles += ' #' + id_html + ' .nep-preloader{width:100%;position:absolute;top:0;right:0;bottom:0;left:0;background:rgba(255, 255, 255, 0.8);border-radius:5px;z-index:9999;display:none;}';

        popup_styles += '.nep-prell-ring {display: block;width:' + this.config.popup_config.prel_size + 'px;height:' + this.config.popup_config.prel_size + 'px;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);} .nep-prell-ring::after {content: " ";display: block;width:' + this.config.popup_config.prel_size + 'px;height:' + this.config.popup_config.prel_size + 'px;border-radius: 50%;border:' + this.config.popup_config.prel_bsize + 'px solid #fff;border-color: #fff transparent #fff transparent;animation: nep-ring 1.2s linear infinite;}.nep-prell-ring::after {border:' + this.config.popup_config.prel_bsize + 'px solid ' + this.config.popup_config.prel_color + ';border-color: ' + this.config.popup_config.prel_color + ' transparent ' + this.config.popup_config.prel_color + ' transparent;';
        popup_styles += this._make_css_rules('desctop', 'preloader_');
        popup_styles += '}';
        popup_styles += '@keyframes nep-ring {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}';

        //popUp show class
        popup_styles += ' #' + id_html + '.nep-popup-wrap-show{z-index:999999!important;opacity:1!important;}';

            //Content block
        popup_styles += ' #' + id_html + ' .nep-popup-block{cursor:default;box-sizing:border-box;position:relative;margin:auto;display:flex;overflow:auto;overscroll-behavior-y:contain;max-width:100%;min-height:60px;transition: all 0.4s cubic-bezier(0,1.07,.84,1.19);';
        popup_styles += this._make_css_rules('desctop', 'block_');
        popup_styles += '}';

            //Close button
        popup_styles += ' #' + id_html + ' .nep-popup-close{all:unset;position:absolute!important;z-index: 99;cursor:pointer!important;border:0!important;line-height:0!important;width:24px!important;padding:0!important;height:24px!important;display:block;line-height:24px;font-family:sans-serif;text-align: center;';
        popup_styles += this._make_css_rules('desctop', 'close_');
        popup_styles += '}';
        popup_styles += ' .nep-popup-close span{width:24px!important;height:24px!important;display:block;line-height:24px;margin: 0 auto;}';

            //Close button hover
        popup_styles += ' #' + id_html + '.nep-popup-close:hover{';
        popup_styles += this._make_css_rules('desctop', 'hclose_');
        popup_styles += '}';

        //PopUp content
        popup_styles += '.nep-pop-content{width: 100%;}';

        //Disable scroll
        popup_styles += '.disable-scroll{overflow:hidden;}';

        //Tablet styles
        popup_styles += ' @media only screen and (max-width:' +  this.config.popup_config.tablet_trig + '){';
            popup_styles += ' #' + id_html + ' .nep-popup-wrap{';
            popup_styles += this._make_css_rules('tablet', 'wrap_');
            popup_styles += '}';

            popup_styles += ' #' + id_html + ' .nep-preloader{';
            popup_styles += this._make_css_rules('tablet', 'preloader_');
            popup_styles += '}';

            popup_styles += ' #' + id_html + ' .nep-popup-block{';
            popup_styles += this._make_css_rules('tablet', 'block_');
            popup_styles += '}';

            popup_styles += ' #' + id_html + ' .nep-popup-close{';
            popup_styles += this._make_css_rules('tablet', 'close_');
            popup_styles += '}';

            popup_styles += ' #' + id_html + ' .nep-popup-close:hover{';
            popup_styles += this._make_css_rules('tablet', 'hclose_');
            popup_styles += '}';

        popup_styles += '}';

        //Mobile styles
        popup_styles += ' @media only screen and (max-width:' +  this.config.popup_config.mobile_trig + '){';
                popup_styles += ' #' + id_html + ' .nep-popup-wrap{';
                popup_styles += this._make_css_rules('mobile', 'wrap_');
                popup_styles += '}';

                popup_styles += ' #' + id_html + ' .nep-preloader{';
                popup_styles += this._make_css_rules('mobile', 'preloader_');
                popup_styles += '}';

                popup_styles += ' #' + id_html + ' .nep-popup-block{';
                popup_styles += this._make_css_rules('mobile', 'block_');
                popup_styles += '}';

                popup_styles += ' #' + id_html + ' .nep-popup-close{';
                popup_styles += this._make_css_rules('mobile', 'close_');
                popup_styles += '}';

                popup_styles += ' #' + id_html + ' .nep-popup-close:hover{';
                popup_styles += this._make_css_rules('mobile', 'hclose_');
                popup_styles += '}';
        popup_styles += '}';


        //PopUp ajax content
        popup_styles += '.nep-popup-content-val{transition: all 0.4s ease-in-out;}';
        popup_styles += '.nep-popup-hide{opacity:0;margin-top:10% !important;height: 0px !important;}';


        //Insert styles in header
        let head = document.head || document.getElementsByTagName('head')[0],
            popup_style = document.createElement('style');
        popup_style.id = id_el;
        head.appendChild(popup_style);
        popup_style.appendChild(document.createTextNode(popup_styles));

    }
    
    //Make rules
    _make_css_rules(type, cls){
        if(!type) type = 'desctop';
        let rules;
        switch (type) {
            case 'desctop':
                if(this.config.desctop){
                    rules = this.config.desctop;
                }
                break;
            case 'tablet':
                if(this.config.tablet){
                    rules = this.config.tablet;
                }
                break;
            case 'mobile':
                 if(this.config.mobile){
                    rules = this.config.mobile;
                }
                break;
        }
        if(!rules) return;

        let out = '';
        Object.keys(rules).forEach(function eachKey(key) {
            if( key.startsWith(cls) ){
                out += key.replace(cls, '').replace(/_/, '-') + ':' + rules[key] + ';';
            }
        });
        return out;
    }

    _replaceCssStyles(attr){

        //let out = '';
        for (let i = 0; i < attr.length; i++) {
            //Wraper
            if( attr[i].name.startsWith('data-npwd-') ){
                let cname = 'wrap_' + attr[i].name.replace('data-npwd-', '').replace(/_/, '-');
                this.config.desctop[cname] = attr[i].value;
            }else if(attr[i].name.startsWith('data-npwt-')){
                let cname = 'wrap_' + attr[i].name.replace('data-npwt-', '').replace(/_/, '-');
                this.config.tablet[cname] = attr[i].value;
            }else if(attr[i].name.startsWith('data-npwm-')){
                let cname = 'wrap_' + attr[i].name.replace('data-npwm-', '').replace(/_/, '-');
                this.config.mobile[cname] = attr[i].value;
            }

            //Preloader
            if( attr[i].name.startsWith('data-nppd-') ){
                let cname = 'preloader_' + attr[i].name.replace('data-nppd-', '').replace(/_/, '-');
                this.config.desctop[cname] = attr[i].value;
            }else if(attr[i].name.startsWith('data-nppt-')){
                let cname = 'preloader_' + attr[i].name.replace('data-nppt-', '').replace(/_/, '-');
                this.config.tablet[cname] = attr[i].value;
            }else if(attr[i].name.startsWith('data-nppm-')){
                let cname = 'preloader_' + attr[i].name.replace('data-nppm-', '').replace(/_/, '-');
                this.config.mobile[cname] = attr[i].value;
            }

            //Content
            if( attr[i].name.startsWith('data-npbd-') ){
                let cname = 'block_' + attr[i].name.replace('data-npbd-', '').replace(/_/, '-');
                this.config.desctop[cname] = attr[i].value;
            }else if(attr[i].name.startsWith('data-npbt-')){
                let cname = 'block_' + attr[i].name.replace('data-npbt-', '').replace(/_/, '-');
                this.config.tablet[cname] = attr[i].value;
            }else if(attr[i].name.startsWith('data-npbm-')){
                let cname = 'block_' + attr[i].name.replace('data-npbm-', '').replace(/_/, '-');
                this.config.mobile[cname] = attr[i].value;
            }

            //Close
            if( attr[i].name.startsWith('data-npcd-') ){
                let cname = 'close_' + attr[i].name.replace('data-npcd-', '').replace(/_/, '-');
                this.config.desctop[cname] = attr[i].value;
            }else if(attr[i].name.startsWith('data-npct-')){
                let cname = 'close_' + attr[i].name.replace('data-npct-', '').replace(/_/, '-');
                this.config.tablet[cname] = attr[i].value;
            }else if(attr[i].name.startsWith('data-npcm-')){
                let cname = 'close_' + attr[i].name.replace('data-npcm-', '').replace(/_/, '-');
                this.config.mobile[cname] = attr[i].value;
            }
        }

    }

    //Make html PopUp
    _MakeHtmlPopUp(id_el, id_cls){
        if( !id_el || !id_cls) return;
        let popup_div = '<div class="nep-popup-wrap" id="' + id_el + '"><div class="nep-popup-block nep-popup-hide ' + this.config.cust_cl_popup + '">' +
          '<button type="button" id="' + id_cls + '" class="nep-popup-close" aria-label="Close"><span class="nep-popup-close-cnt" aria-hidden="true">×</span></button>' +
          '<div class="nep-pop-content"></div>' +
          '</div></div>';
        document.body.insertAdjacentHTML('beforeend', popup_div);
    }

    /**
     * Random number
     */
    _make_rnum(min = 1, max = 999){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Add events
     */
    eventsFeeler(config){
        document.addEventListener("click", function (e) {
            let curel;
            if(!e.target.classList.contains(config.clickClassPopaps)){
                const parel = e.target.closest('.' + config.clickClassPopaps);
                if(parel && parel.classList.contains(config.clickClassPopaps)){
                    curel = parel;
                }else{
                    return;
                }
            }else{
                curel = e.target;
            }

            //Call PopUp
            let clickedlink = curel.closest("[" + config.clickbyAttribute + "]");

            if(!clickedlink && curel.classList.contains(config.clickClassPopaps)  ){
                clickedlink = curel;

            }else if(curel.attributes.href && (curel.attributes.href.nodeValue === config.clickUrlPopaps || curel.attributes.href.nodeValue === '/' + config.clickUrlPopaps)){
                clickedlink = curel;

            }else if(!clickedlink){
                return;

            }

            e.preventDefault();

            const cust_cl_popup = curel.getAttribute('data-nep-cust-pclass');
            this.config.cust_cl_popup = cust_cl_popup || '';

            document.getElementsByTagName('body')[0].classList.add("disable-scroll");

            let popup_id = curel.getAttribute('id');
            this.postid = curel.getAttribute('data-pid');

            if(!popup_id){
                popup_id = 'id' + this._make_rnum(2, Math.round(new Date().getTime()/1000));
                curel.setAttribute("id", popup_id);
            }

            if(popup_id){
                let ids = {
                    nameid : popup_id,
                    style_id : 'nep-style-' + popup_id,
                    html_id : 'nep-html-' + popup_id,
                    close_id : 'nep-cls-' + popup_id,
                }


                //Get all current data attributes
                let all_attr = [].filter.call(clickedlink.attributes, function(at) { return /^data-/.test(at.name); });


                //Replace rules by tag attr
                this._replaceCssStyles(all_attr);

                //Make Css
                this._makeCssStyles(ids.style_id, ids.html_id);
                //Make html
                this._MakeHtmlPopUp(ids.html_id, ids.close_id);
                //Add ids to array
                this.popups.push({ ids });

                //Make content
                let cont_container = document.querySelector('#' + ids.html_id + ' .nep-pop-content');

                for (let i = 0; i < all_attr.length; i++) {

                    //Make image content
                    if(all_attr[i].name === this.config.innerContentAttribute && all_attr[i].value === 'src'){
                        cont_container.innerHTML = '<img class="nep-popup-content-val" style="margin:auto;display:block;" src="' + clickedlink.getAttribute('src') + '"/>';

                    //Make href in iframe content
                    }else if(all_attr[i].name === this.config.innerContentAttribute && all_attr[i].value === 'href'){
                        cont_container.innerHTML = '<iframe class="nep-popup-content-val" src="' + clickedlink.getAttribute('href') + '" width="100%" height="100%" style="width: 100%; height: 100%;"></iframe>';

                    //Make content from element by ID
                    }else if(all_attr[i].name === this.config.idContentElement && all_attr[i].value){
                        cont_container.innerHTML = '<div class="nep-popup-content-val">' + document.getElementById(all_attr[i].value).innerHTML + '</div>';

                    //Make Json content
                    }else if( (all_attr[i].name === this.config.ajaxContentAttribute || all_attr[i].name === this.config.ajaxContentAction)  && all_attr[i].value){

                         //Event on product page
                        const page_type = clickedlink.getAttribute('data-page-type');
                        const prod_id = clickedlink.getAttribute('data-product-id');
                        if(page_type && page_type === 'product' && prod_id){

                          let data = {
                            prod_add_to_cart: 1,
                            prod_item_id: prod_id,
                            action: 'nep-addtocart'
                          };

                          nep_ajax_request(data).then(function (res){
                              let wpaction = curel.getAttribute(this.config.ajaxContentAction);
                              this._getAjaxContent(cont_container, all_attr[i].value, wpaction);
                          }.bind(this));

                        }else{
                             let wpaction = curel.getAttribute(this.config.ajaxContentAction);
                            this._getAjaxContent(cont_container, all_attr[i].value, wpaction);
                        }

                    }

                }

                //Show popup
                document.getElementById(ids.html_id).classList.add("nep-popup-wrap-show");

                //Close button popup
                document.getElementById(ids.close_id).addEventListener('click', evt => this._ClosePopUp(ids), true);

                //Close by click on overlay
                document.getElementById(ids.html_id).addEventListener('click', function (e) {
                    if (e.currentTarget.id !== ids.html_id || e.currentTarget !== e.target ) return;
                    this._ClosePopUp(ids);
                }.bind(this), true);

            }else{
                console.error('Not set ID for element on click');
            }


        }.bind(this));

        //Escape
        window.addEventListener("keyup", function (e) {
            if(this.popups.length < 1) return;
            let isEscape = false;
            if ('key' in e) {
                isEscape = (e.key === "Escape" || e.key === "Esc");
            } else {
                isEscape = (e.keyCode === 27);
            }

            if (isEscape) {
                let idscur = this.popups[this.popups.length - 1];
                this._ClosePopUp(idscur.ids);
                //this.popups = this.popups.slice(0, -1);
            }
        }.bind(this));
    }

    _getAjaxContent(container, param, wpaction){
        if(!container) return;

        this._Preloader(document.querySelector('.nep-popup-wrap')); //Show preloader

        if (!window.XMLHttpRequest) return null;
        const fbxhr = new XMLHttpRequest();

        let form = new FormData();

        if(wpaction){
            form.append('action', wpaction); //Call WordPress functions ajax
        }

        //Nonce for Ajax
        let nonce = '';
        if(typeof nepajax !== 'undefined' ){
            nonce = nepajax.jnn
        }else{
            console.error('Not found Ajax nonce');
            return;
        }

        if(this.postid){
            form.append('pid', this.postid);
        }

        form.append('nonce_code', nonce); //Set value wpnonce
        form.append('arg', param);

        fbxhr.addEventListener('load', function (e) {
            if (e.currentTarget.status === 200 && e.currentTarget.responseText) {

                container.innerHTML = '<div class="nep-popup-content-val" style="width:100%;height:100%;max-height:100vh;">' + e.currentTarget.responseText + '</div>';

                 let scrpts = container.getElementsByTagName('script');

                 if(scrpts.length > 0){
                    for (let i = 0; i < scrpts.length; i++) {
                        //eval(scrpts[i].innerHTML);
                        let srcjs = scrpts[i].getAttribute('src');
                        let idjs = scrpts[i].getAttribute('id');
                        if(srcjs){
                            let tag = document.createElement("script");
                            tag.setAttribute("src", srcjs);
                            tag.setAttribute("id", idjs + '-ins');
                            document.body.appendChild(tag);
                        }
                    }
                 }

                 setTimeout(() => {
                   document.querySelector('.nep-prell-ring').remove();
                   document.querySelector('.nep-popup-block').classList.remove('nep-popup-hide');
                }, 500);



            } else {
                container.innerHTML = '<div class="nep-popup-content-error" style="width:100%;color:red;text-align:center;margin: 30px 0;">' + nepajax.ops + '</div>';
                document.querySelector('.nep-prell-ring').remove();
                document.querySelector('.nep-popup-block').classList.remove('nep-popup-hide');
                console.error(nepajax.ops);
            }
        });

        fbxhr.addEventListener("error", function (e) {
            container.innerHTML = '<div class="nep-popup-content-error" style="width:100%;color:red;text-align:center;margin: 30px 0;">' + nepajax.ops + '</div>';
            document.querySelector('.nep-prell-ring').remove();
            document.querySelector('.nep-popup-block').classList.remove('nep-popup-hide');
            console.error(nepajax.ops);

        });

        // Set up our request
        let ajaxurl = nepajax.url;
        fbxhr.open("POST", ajaxurl);
        //fbxhr.setRequestHeader("Cache-Control", "max-age=3600");
        // The data sent is what the user provided in the form
        fbxhr.send(form);

    }

    _Preloader(cont){
        let prel = document.createElement('div');
        prel.id = 'frmprel';
        prel.class = 'nep-preloader';
        prel.innerHTML = '<div class="nep-prell-ring"></div>';
        cont.appendChild(prel);

    }


    _ClosePopUp(ids){
        if(!ids) return;
        let cur_html = document.getElementById(ids.html_id);
        let cur_css = document.getElementById(ids.style_id);
        if(cur_html){
            document.getElementsByTagName('body')[0].classList.remove("disable-scroll");
            cur_html.classList.remove("nep-popup-wrap-show");

            let all_scripts = cur_html.getElementsByTagName('script');
            if(all_scripts.length > 0){
                //console.log('all_scripts: %o', all_scripts );
                Array.from(all_scripts).forEach(function(el, i){
                    el.parentNode.removeChild(el);
                });
                //console.log('all_scripts: %o', document.getElementsByTagName('script') );
            }

            if(cur_css) cur_css.remove();
            cur_html.remove();
            this.config = JSON.parse(JSON.stringify(this._oldConf));
            this.popups = this.popups.slice(0, -1);

            if(window.nepchange && window.nepchange > 0){
                document.location.reload();
            }



        }
    }

    _removeJS(tags){
     for (var i = tags.length; i >= 0; i--){ //search backwards within nodelist for matching elements to remove
      if (tags[i]){
          tags[i].parentNode.removeChild(tags[i]);
          tags[i].remove();

      }

     }
    }


    /* Set Cookie */
    _setCookie(cname, cvalue, exdays) {
        let d = new Date;
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * exdays);
        document.cookie = cname + "=" + cvalue + ";path=/;expires=" + d.toGMTString();
    }

    /* Save to cookie Name & Email */
    _savecook() {
            let cooks = {};
            let cname = document.getElementById('fbname');
            if (cname.value) cooks.cname = cname.value;
            let cmail = document.getElementById('fbemail');
            if (cmail.value) cooks.cmail = cmail.value;
            if(cooks) nep._setCookie('nepuser', JSON.stringify(cooks).toString(), 366);
    }

    /* Save to cookie Name & Email */
    _delcook() {
        nep._setCookie('nepuser', '', -1);
    }


}

/* Call PopUp */
new nepPopUps();


