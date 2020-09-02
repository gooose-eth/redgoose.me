<?php
namespace Core;
use Dotenv\Dotenv, redgoose\Console, redgoose\RestAPI, Exception, Parsedown;

if (!defined('__GOOSE__')) exit();

// load autoload
require __PATH__.'/./vendor/autoload.php';

// set dotenv
try
{
  $dotenv = Dotenv::createImmutable(__PATH__);
  $dotenv->load();
}
catch(Exception $e)
{
  throw new Exception('.env error');
}

// ini_set
if ($_ENV['APP_USE_DEBUG'] === '1')
{
  error_reporting(E_ALL & ~E_NOTICE);
}

// set values
define('__ROOT__', $_ENV['APP_PATH_RELATIVE']);
define('__API__', $_ENV['APP_PATH_API']);
define('__URL__', $_ENV['APP_PATH_URL']);

// set default timezone
if ($_ENV['APP_TIMEZONE'])
{
  date_default_timezone_set($_ENV['APP_TIMEZONE']);
}

// set blade
$blade = new Blade(__PATH__.'/view', __PATH__.'/cache/view');

// set router
try {
  $router = new AppRouter();

  // not found page
  if (!$router->match)
  {
    throw new Exception('Not found page', 404);
  }

  // play route
  $_target = $router->match['target'];
  $_params = (object)$router->match['params'];

  // init rest api
  $api = new RestAPI((object)[
    'url' => $_ENV['APP_PATH_API'],
    'outputType' => 'json',
    'headers' => ['Authorization: ' . $_ENV['APP_TOKEN_PUBLIC']],
    'timeout' => 30,
    'debug' => false,
  ]);

  switch($_target)
  {
    case 'index':
      $page = AppUtil::getPage();
      $size = (int)$_ENV['APP_DEFAULT_INDEX_SIZE'];
      $randomSize = 8;

      // get articles
      $res = $api->call('get', '/external/redgoose-me/', (object)[
        'field' => 'srl,type,nest_srl,category_srl,json,title,order',
        'order' => '`order` desc, `srl` desc',
        'app' => $_ENV['APP_DEFAULT_APP_SRL'],
        'size' => $size,
        'page' => $page,
        'ext_field' => 'category_name,nest_name',
        'random_date' => '1 year',
        'random_field' => 'order',
        'random_count' => $page === 1 ? $randomSize : 0,
        'random_merge' => false,
        'random_range' => 'YmdH',
        'shuffle' => false,
      ]);
      if (!isset($res->response)) throw new Exception($res->message, $res->code);
      $res = $res->response;
      if (!($res && $res->success)) throw new Exception($res->message, $res->code);

      // convert articles
      $tmpArticles = AppUtil::getWorksData($res->data->index);
      $articles = (object)[
        'head' => $tmpArticles ? array_slice($tmpArticles, 0,4) : [],
        'body' => $tmpArticles ? array_slice($tmpArticles, 4) : [],
      ];

      // make pagination
      if ($tmpArticles && count($tmpArticles) > 0)
      {
        $paginate = AppUtil::makePagination($res->data->total, $page, $size);
      }

      // render page
      $blade->render('index', (object)[
        'title' => $_ENV['APP_TITLE'],
        'pageTitle' => 'Newest works',
        'count' => $tmpArticles ? count($tmpArticles) : 0,
        'index' => $articles,
        'randomIndex' => (isset($res->data->random)) ? AppUtil::getWorksData($res->data->random) : [],
        'paginate' => isset($paginate) ? $paginate : null,
        'navigation' => AppUtil::getNavigation(),
      ]);
      break;

    case 'index/nest':
      $page = AppUtil::getPage();
      $size = (int)$_ENV['APP_DEFAULT_INDEX_SIZE'];

      $res = $api->call('get', '/external/redgoose-me-nest/', (object)[
        'app_srl' => $_ENV['APP_DEFAULT_APP_SRL'],
        'nest_id' => isset($_params->id) ? $_params->id : '',
        'category_srl' => isset($_params->srl) ? $_params->srl : null,
        'page' => AppUtil::getPage(),
        'size' => $_ENV['APP_DEFAULT_INDEX_SIZE'],
        'order' => '`order` desc, `srl` desc',
        'ext_field' => 'count_article',
      ]);
      if (!isset($res->response)) throw new Exception($res->message, $res->code);
      $res = $res->response;
      if (!($res && $res->success)) throw new Exception($res->message);

      // make pagination
      if (isset($res->data->works->index) && count($res->data->works->index) > 0)
      {
        $paginate = AppUtil::makePagination($res->data->works->total, $page, $size);
      }

      $title = 'redgoose';
      if (isset($res->data->nest->name)) $title = $res->data->nest->name.' / '.$title;
      // render page
      $blade->render('index-nest', (object)[
        'title' => $title,
        'pageTitle' => $res->data->nest->name,
        'nest_id' => $_params->id,
        'nest_srl' => $res->data->nest->srl,
        'category_srl' => isset($_params->srl) ? $_params->srl : null,
        'categories' => $res->data->categories,
        'categoryName' => isset($res->data->category->name) ? $res->data->category->name : null,
        'index' => AppUtil::getWorksData($res->data->works->index),
        'paginate' => isset($paginate) ? $paginate : null,
        'navigation' => AppUtil::getNavigation(),
      ]);
      break;

    case 'article':
      $res = $api->call('get', '/articles/'.(int)$_params->srl.'/', (object)[
        'app' => $_ENV['APP_DEFAULT_APP_SRL'],
        'hit' => AppUtil::checkCookie('redgoose-hit-'.$_params->srl) ? 0 : 1,
        'ext_field' => 'category_name,nest_name'
      ]);
      if (!isset($res->response)) throw new Exception($res->message, $res->code);
      $res = $res->response;
      if (!($res && $res->success)) throw new Exception($res->message, $res->code);
      $res->data->regdate = AppUtil::convertDate($res->data->regdate);

      // add key in cookie
      if (!AppUtil::checkCookie('redgoose-hit-'.$_params->srl))
      {
        AppUtil::setCookie('redgoose-hit-'.$_params->srl, '1', 7);
      }

      // parse markdown
      $parsedown = new Parsedown();
      $res->data->content = $parsedown->text($res->data->content);

      // render page
      $blade->render('detail', (object)[
        'title' => ($res->data->title === '.' ? 'Untitled work' : $res->data->title).' on '.$_ENV['APP_TITLE'],
        'pageTitle' => $res->data->title === '.' ? 'Untitled work' : $res->data->title,
        'description' => AppUtil::contentToShortText($res->data->content),
        'image' => __API__.'/'.$res->data->json->thumbnail->path,
        'data' => $res->data,
        'onLike' => AppUtil::checkCookie('redgoose-star-'.$_params->srl),
        'navigation' => AppUtil::getNavigation(),
      ]);
      break;

    case 'page':
      $_page = $_params->name;
      // check page file
      if (!file_exists(__PATH__.'/view/pages/'.$_page.'.blade.php'))
      {
        throw new Exception('Not found page', 404);
      }
      $blade->render('pages.'.$_page, (object)[
        'navigation' => AppUtil::getNavigation(),
      ]);
      break;

    case 'rss':
      $data = (object)[
        'url' => __URL__,
        'title' => $_ENV['APP_TITLE'],
        'description' => $_ENV['APP_DESCRIPTION'],
        'link' => __URL__,
      ];
      // get data
      $res = $api->call('get', '/articles/', (object)[
        'app' => $_ENV['APP_DEFAULT_APP_SRL'],
        'field' => 'srl,type,nest_srl,category_srl,json,title,content,order',
        'size' => $_ENV['APP_DEFAULT_RSS_SIZE'],
        'order' => '`order` desc, `srl` desc',
      ]);
      if (!isset($res->response)) throw new Exception($res->message, $res->code);
      $res = $res->response;

      // make articles
      if ($res->success && isset($res->data->index) && count($res->data->index))
      {
        // parse markdown
        $parsedown = new Parsedown();
        $data->articles = [];
        foreach($res->data->index as $k=>$item)
        {
          $data->articles[] = (object)[
            'srl' => $item->srl,
            'title' => htmlspecialchars($item->title),
            'date' => date_format(date_create($item->order), 'D, d M Y H:i:s +0900'),
            'content' => $parsedown->text($item->content),
            'thumbnail' => isset($item->json->thumbnail->path) ? __API__.'/'.$item->json->thumbnail->path : null,
          ];
        }
      }
      // set header
      AppUtil::setHeader('rss');
      // render
      $blade->render('rss', $data);
      break;

    case 'on-like':
      $res = $api->call(
        'get',
        '/articles/'.(int)$_params->srl.'/update/',
        (object)[ 'type' => 'star' ]
      );
      if (!isset($res->response)) throw new Exception($res->message, $res->code);
      $res = $res->response;
      echo json_encode($res);
      break;

    case 'lab':
      if ($_ENV['APP_DEV'] === '1' && file_exists(__PATH__.'/./core/lab.php'))
      {
        require __PATH__.'/./core/lab.php';
      }
      else
      {
        throw new Exception('Not found page', 404);
      }
      break;

    default:
      throw new Exception('Not found page', 404);
  }
}
catch (Exception $e)
{
  AppUtil::error($e, $blade);
}
