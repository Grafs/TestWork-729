<?php
/**
 * Add Product Template
 *
 * @package AbeloHost
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

			<?php
			while ( have_posts() ) :
				the_post();
				do_action( 'storefront_page_before' );
			?>

				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

					<?php
					/* Functions hooked in to storefront_page add_action */
					do_action( 'storefront_page' );

					/* Require product form */
					require_once (TSK_PLUGIN_PUTH . 'inc/front/add_product_form.php');
					?>

				</article>

			<?php

				/**
				 * Functions hooked in to storefront_page_after action
				 *
				 * @hooked storefront_display_comments - 10
				 */
				do_action( 'storefront_page_after' );

			endwhile; // End of the loop.
			?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php

do_action( 'storefront_sidebar' );

get_footer();










