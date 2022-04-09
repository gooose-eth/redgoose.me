<?php
if(!defined("__GOOSE__")){exit();}

/** @var string $title */
/** @var string $pageTitle */
/** @var array $articles */
/** @var object $paginate */
/** @var array $categories */
/** @var string $categoryName */
?>

@extends('layout')

@section('meta')
<title>{{$title}}</title>
<meta name="description" content="{{$_ENV['APP_DESCRIPTION']}}"/>
<meta property="og:title" content="{{$title}}"/>
<meta property="og:description" content="{{$_ENV['APP_DESCRIPTION']}}">
<meta property="og:image" content="{{__URL__}}/assets/images/og-redgoose.jpg">
@endsection

@section('contents')
<article class="index">
  <header class="index-header">
    <h1 class="index-header__title">{{$pageTitle}}</h1>
    @if (count($categories ?? []) > 0)
    <nav class="index-categories">
      <button type="button" class="index-categories__toggle-button">
        <span>
          <em>Categories / {{$categoryName ? $categoryName : 'All'}}</em>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6">
            <g fill="none" fill-rule="evenodd">
              <path fill="currentColor" d="M12 0L6 6 0 0z"></path>
            </g>
          </svg>
        </span>
      </button>
      <nav>
        <ul>
          @foreach($categories as $k=>$item)
          <li{!!($category_srl === $item->srl || (!$category_srl && !$item->srl)) ? ' class="on"' : ''!!}>
            <a href="/nest/{{$nest_id}}{{$item->srl ? '/'.$item->srl : ''}}/" data-srl="{{$item->srl}}">
              <span>{{$item->name}}</span>
              <em>{{$item->count_article}}</em>
            </a>
          </li>
          @endforeach
        </ul>
      </nav>
    </nav>
    @endif
  </header>
  <div class="index-works index-works--head">
    @if ($articles && count($articles))
    <ul class="index-works__list">
      @foreach($articles as $k=>$item)
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
            <span>
              <em>{{$item->regdate}}</em>
            </span>
          </div>
        </a>
      </li>
      @endforeach
    </ul>
    @else
    <div class="index-empty">
      <img src="{{__ROOT__}}/assets/images/img-error.png" alt="error">
      <p>Not found article.</p>
    </div>
    @endif
    @if ($paginate->desktop ?? false)
    <div class="index-paginate">
      {!! $paginate->mobile !!}
      {!! $paginate->desktop !!}
    </div>
    @endif
  </div>
</article>
@endsection
