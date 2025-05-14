# ext::postgis

This extension exposes the functionality of the PostGIS library. It is a vast library dedicated to handling geographic and various geometric data. The scope of the EdgeDB extension is to mainly adapt the types and functions used in this library with minimal changes.

As a rule, many of the functions in PostGIS library have a ST_` prefix, however, we omitted it since in EdgeDB all these functions would already be in the ext::postgis namespace and additional disambiguation is unnecessary.

## Types

There are four basic scalar types introduced by this extension:

Type: type
Domain: eql
Summary: The type representing 2- or 3-dimensional spatial features.
Signature: type postgis::geometry


The type representing 2- or 3-dimensional spatial features.

By default most of the geometry values are assumed to be representing planar geometry in a Cartesian coordinate system.

Every other ext::postgis scalar type is castable into geometry. Many of the PostGIS functions only accept geometry as input.

Type: type
Domain: eql
Summary: The type representing spatial features with geodetic coordinate systems.
Signature: type postgis::geography


The type representing spatial features with geodetic coordinate systems.

The PostGIS geography data type provides native support for spatial features represented on “geographic” coordinates (sometimes called “geodetic” coordinates, or “lat/lon”, or “lon/lat”). Geographic coordinates are spherical coordinates expressed in angular units (degrees).

Type: type
Domain: eql
Summary: The type representing a 2-dimensional bounding box.
Signature: type postgis::box2d


The type representing a 2-dimensional bounding box.

Type: type
Domain: eql
Summary: The type representing a 3-dimensional bounding box.
Signature: type postgis::box3d


The type representing a 3-dimensional bounding box.

## Operators

There are many functions available for processing all this geometric and geographic data. Of note are the functions that represent operations affected by the indexes (pg::gist, pg::brin, and pg::spgist). These functions all have a op_ prefix to help identify them.

Type: function
Domain: eql
Summary: This is exposing the |>> operator.
Signature: function ext::postgis::op_abovestd::bool


This is exposing the |>> operator.

Type: function
Domain: eql
Summary: This is exposing the <<| operator.
Signature: function ext::postgis::op_belowstd::bool


This is exposing the <<| operator.

Type: function
Domain: eql
Summary: This is exposing the <<@ operator.
Signature: function ext::postgis::op_contained_3dstd::bool


This is exposing the <<@ operator.

Type: function
Domain: eql
Summary: This is exposing the ~ operator.
Signature: function ext::postgis::op_containsstd::bool


This is exposing the ~ operator.

Type: function
Domain: eql
Summary: This is exposing the ~ operator.
Signature: function ext::postgis::op_contains_2dstd::bool
Signature: function ext::postgis::op_contains_2dstd::bool
Signature: function ext::postgis::op_contains_2dstd::bool


This is exposing the ~ operator.

Type: function
Domain: eql
Summary: This is exposing the @>> operator.
Signature: function ext::postgis::op_contains_3dstd::bool


This is exposing the @>> operator.

Type: function
Domain: eql
Summary: This is exposing the ~~ operator.
Signature: function ext::postgis::op_contains_ndstd::bool


This is exposing the ~~ operator.

Type: function
Domain: eql
Summary: This is exposing the <#> operator.
Signature: function ext::postgis::op_distance_boxstd::float64


This is exposing the <#> operator.

Type: function
Domain: eql
Summary: This is exposing the <-> operator.
Signature: function ext::postgis::op_distance_centroidstd::float64


This is exposing the <-> operator.

Type: function
Domain: eql
Summary: This is exposing the <<->> operator.
Signature: function ext::postgis::op_distance_centroid_ndstd::float64


This is exposing the <<->> operator.

Type: function
Domain: eql
Summary: This is exposing the |=| operator.
Signature: function ext::postgis::op_distance_cpastd::float64


This is exposing the |=| operator.

Type: function
Domain: eql
Summary: This is exposing the <-> operator.
Signature: function ext::postgis::op_distance_knnstd::float64


This is exposing the <-> operator.

Type: function
Domain: eql
Summary: This is exposing the @ operator.
Signature: function ext::postgis::op_is_contained_2dstd::bool
Signature: function ext::postgis::op_is_contained_2dstd::bool
Signature: function ext::postgis::op_is_contained_2dstd::bool


This is exposing the @ operator.

Type: function
Domain: eql
Summary: This is exposing the << operator.
Signature: function ext::postgis::op_leftstd::bool


This is exposing the << operator.

Type: function
Domain: eql
Summary: This is exposing the <> operator.
Signature: function ext::postgis::op_neqstd::bool


This is exposing the <> operator.

Type: function
Domain: eql
Summary: This is exposing the |&> operator.
Signature: function ext::postgis::op_overabovestd::bool


This is exposing the |&> operator.

Type: function
Domain: eql
Summary: This is exposing the &<| operator.
Signature: function ext::postgis::op_overbelowstd::bool


This is exposing the &<| operator.

Type: function
Domain: eql
Summary: This is exposing the && operator.
Signature: function ext::postgis::op_overlapsstd::bool
Signature: function ext::postgis::op_overlapsstd::bool


This is exposing the && operator.

Type: function
Domain: eql
Summary: This is exposing the && operator.
Signature: function ext::postgis::op_overlaps_2dstd::bool
Signature: function ext::postgis::op_overlaps_2dstd::bool
Signature: function ext::postgis::op_overlaps_2dstd::bool


This is exposing the && operator.

Type: function
Domain: eql
Summary: This is exposing the &/& operator.
Signature: function ext::postgis::op_overlaps_3dstd::bool


This is exposing the &/& operator.

Type: function
Domain: eql
Summary: This is exposing the &&& operator.
Signature: function ext::postgis::op_overlaps_ndstd::bool


This is exposing the &&& operator.

Type: function
Domain: eql
Summary: This is exposing the &< operator.
Signature: function ext::postgis::op_overleftstd::bool


This is exposing the &< operator.

Type: function
Domain: eql
Summary: This is exposing the &> operator.
Signature: function ext::postgis::op_overrightstd::bool


This is exposing the &> operator.

Type: function
Domain: eql
Summary: This is exposing the >> operator.
Signature: function ext::postgis::op_rightstd::bool


This is exposing the >> operator.

Type: function
Domain: eql
Summary: This is exposing the ~= operator.
Signature: function ext::postgis::op_samestd::bool


This is exposing the ~= operator.

Type: function
Domain: eql
Summary: This is exposing the ~== operator.
Signature: function ext::postgis::op_same_3dstd::bool


This is exposing the ~== operator.

Type: function
Domain: eql
Summary: This is exposing the ~~= operator.
Signature: function ext::postgis::op_same_ndstd::bool


This is exposing the ~~= operator.

Type: function
Domain: eql
Summary: This is exposing the @ operator.
Signature: function ext::postgis::op_withinstd::bool


This is exposing the @ operator.

Type: function
Domain: eql
Summary: This is exposing the @@ operator.
Signature: function ext::postgis::op_within_ndstd::bool


This is exposing the @@ operator.

## Functions

The core functions can be roughly grouped into the following categories.

## Aggregates

These functions operate of sets of geometric data.

Type: function
Domain: eql
Summary: This is exposing st_clusterintersecting.
Signature: function ext::postgis::clusterintersecting_aggoptional array<ext::postgis::geometry>


This is exposing st_clusterintersecting.

Type: function
Domain: eql
Summary: This is exposing st_clusterwithin.
Signature: function ext::postgis::clusterwithin_aggoptional array<ext::postgis::geometry>


This is exposing st_clusterwithin.

Type: function
Domain: eql
Summary: This is exposing st_collect.
Signature: function ext::postgis::collect_aggoptional ext::postgis::geometry


This is exposing st_collect.

Type: function
Domain: eql
Summary: Computes polygonal coverage from a set of polygons.
Signature: function ext::postgis::coverageunion_aggoptional ext::postgis::geometry


Computes polygonal coverage from a set of polygons.

Computes the union of a set of polygons forming a coverage by removing shared edges.

This is exposing st_coverageunion.

Type: function
Domain: eql
Summary: This is exposing st_3dextent.
Signature: function ext::postgis::extent3d_aggoptional ext::postgis::box2d


This is exposing st_3dextent.

Type: function
Domain: eql
Summary: This is exposing st_extent.
Signature: function ext::postgis::extent_aggoptional ext::postgis::box2d


This is exposing st_extent.

Type: function
Domain: eql
Summary: This is exposing st_makeline.
Signature: function ext::postgis::makeline_aggoptional ext::postgis::geometry


This is exposing st_makeline.

Type: function
Domain: eql
Summary: This is exposing st_memunion.
Signature: function ext::postgis::memunion_aggoptional ext::postgis::box2d


This is exposing st_memunion.

Type: function
Domain: eql
Summary: Computes a collection of polygons formed from a set of linework.
Signature: function ext::postgis::polygonize_aggoptional ext::postgis::geometry


Computes a collection of polygons formed from a set of linework.

Computes a collection of polygons formed from the linework of a set of geometries.

This is exposing st_polygonize.

Type: function
Domain: eql
Summary: This is exposing st_union.
Signature: function ext::postgis::union_aggoptional ext::postgis::geometry
Signature: function ext::postgis::union_aggoptional ext::postgis::geometry


This is exposing st_union.

