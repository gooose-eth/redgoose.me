<?php
if(!defined("__GOOSE__")){exit();}

/**
 * intro page
 */

/** @var string $title */
/** @var string $pageTitle */
/** @var array $index */
/** @var int $count */
/** @var array $randomIndex */
/** @var object $paginate */
?>

@extends('layout')

@section('meta')
<title>{{ $title }}</title>
<meta name="description" content="{{ $_ENV['APP_DESCRIPTION'] }}"/>
<meta property="og:title" content="{{ $title }}"/>
<meta property="og:description" content="{{ $_ENV['APP_DESCRIPTION'] }}">
<meta property="og:image" content="{{__URL__}}/assets/images/og-redgoose.jpg">
@endsection

@section('contents')
<article class="intro">
  <h2 class="intro__title">Intro page</h2>
  <div class="index intro__index">
    @if(count($indexHead))
    <div class="index-works index-works--head">
      <ul class="index-works__list">
        @foreach($indexHead as $k=>$item)
        <li class="index-work">
          <a href="/article/{{$item->srl}}/" class="index-work__wrap">
            <figure class="index-work__image">
              @if (isset($item->image))
              <img src="{{$item->image}}" alt="{{$item->title}}">
              @else
              {!! Core\AppEmptyIcon::random() !!}
              @endif
            </figure>
            <div class="index-work__caption">
              <strong>{{$item->title}}</strong>
              @if (isset($item->nestName) || isset($item->categoryName))
              <span>
                @if (isset($item->nestName))
                <em>{{$item->nestName}}</em>
                @endif
                @if (isset($item->categoryName))
                <em>{{$item->categoryName}}</em>
                @endif
              </span>
              @endif
            </div>
          </a>
        </li>
        @endforeach
      </ul>
    </div>
    @endif
    @if(count($indexSpot))
    <div class="index-random-works">
      <ul class="index-random-works__list">
        @foreach($indexSpot as $k=>$item)
        <li class="index-work index-random-works__item">
          <a href="/article/{{$item->srl}}/" class="index-work__wrap">
            <figure class="index-work__image">
              @if (isset($item->image))
              <img src="{{$item->image}}" alt="{{$item->title}}">
              @else
              {!! Core\AppEmptyIcon::random() !!}
              @endif
            </figure>
            <div class="index-work__caption">
              <strong>{{$item->title}}</strong>
              @if (isset($item->nestName) || isset($item->categoryName))
              <span>
                @if (isset($item->nestName))
                <em>{{$item->nestName}}</em>
                @endif
                @if (isset($item->categoryName))
                <em>{{$item->categoryName}}</em>
                @endif
              </span>
              @endif
            </div>
          </a>
        </li>
        @endforeach
      </ul>
    </div>
    @endif
    @if(count($indexBody))
    <div class="index-works index-works--body">
      <ul class="index-works__list">
        @foreach($indexBody as $k=>$item)
        <li class="index-work">
          <a href="/article/{{$item->srl}}/" class="index-work__wrap">
            <figure class="index-work__image">
              @if (isset($item->image))
              <img src="{{$item->image}}" alt="{{$item->title}}">
              @else
              {!! Core\AppEmptyIcon::random() !!}
              @endif
            </figure>
            <div class="index-work__caption">
              <strong>{{$item->title}}</strong>
              @if (isset($item->nestName) || isset($item->categoryName))
              <span>
                @if (isset($item->nestName))
                <em>{{$item->nestName}}</em>
                @endif
                @if (isset($item->categoryName))
                <em>{{$item->categoryName}}</em>
                @endif
              </span>
              @endif
            </div>
          </a>
        </li>
        @endforeach
      </ul>
    </div>
    @endif
    @if (!(count($indexHead) || count($indexSpot) || count($indexBody)))
    <div class="index-empty">
      <img src="{{__ROOT__}}/assets/images/img-error.png" alt="error">
      <p>Not found article.</p>
    </div>
    @endif
    @if ($paginate->mobile || $paginate->desktop)
    <div class="index-paginate">
      {!! $paginate->mobile !!}
      {!! $paginate->desktop !!}
    </div>
    @endif
  </div>
</article>
@endsection
