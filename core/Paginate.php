<?php
namespace Core;

if (!defined('__GOOSE__')) exit();

class Paginate {

	var $total, $page, $size, $scale;
	var $start_page, $page_max, $offset, $block, $tails;

	/**
	 * Paginate
	 *
	 * @param int $total
	 * @param int $page page number
	 * @param array $arr url parameter
	 * @param int $size count of list
	 * @param int $scale count of page
	 * @param int $start_page start page number
	 */
	public function __construct($total=0, $page=1, $arr=[], $size=10, $scale=10, $start_page=1)
	{
		$this->total = $total ? $total : 0;
		$this->page = $page ? $page : 1;
		$this->size = $size ? $size : 10;
		$this->scale = $scale ? $scale : 10;
		$this->start_page = $start_page ? $start_page : 1;

		$this->page_max = ceil($this->total / $this->size); // 총 페이지개수
		$this->offset = ($this->page - 1) * $this->size; // 해당 페이지에서 시작하는 목록번호
		$this->block = floor(($this->page - 1) / $this->scale); // 페이지를 10개씩보여준다면 1~10페이지까지는 0블럭..
		$this->no = $this->total - $this->offset; // 목록에서 번호나열할때 필요함

		$tails = '';
		if (is_array($arr))
		{
			foreach ($arr as $key=>$val)
			{
				$tails .= ($val) ? "$key=$val&" : "";
			}
		}
		$this->tails = substr($tails, 0, -1);
	}

	/**
	 * Make navigation element
	 *
	 * @param string $className
	 * @return string
	 */
	public function createNavigation($className='paginate')
	{
		$op = null;

		if($this->total > $this->size)
		{
			$op = "<nav class='$className'>\n";
			if ($this->block > 0)
			{
				$prev_block = ($this->block - 1) * $this->scale + 1;
				$str = ($prev_block == 1) ? "" : "page=$prev_block";
				$amp = ($this->tails && $str) ? "&" : "";
				$str = ($str || $this->tails) ? "?".$this->tails.$amp.$str : "";
				$op .= "<a href=\"./$str\" title=\"Prev\" class=\"prev\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z\"/></svg></a>\n";
			}
			else
			{
				$op .= "";
			}
			$this->start_page = $this->block * $this->scale + 1;

			for ($i = 1; $i <= $this->scale && $this->start_page <= $this->page_max; $i++, $this->start_page++)
			{
				if ($this->start_page == $this->page)
				{
					$op .= "<strong>$this->start_page</strong>\n";
				}
				else
				{
					$str = ($this->start_page == 1) ? "" : "page=$this->start_page";
					$amp = ($this->tails && $str) ? "&" : "";
					$str = ($str || $this->tails) ? "?" . $this->tails . $amp . $str : "";
					$op .= "<a href=\"./$str\">$this->start_page</a>\n";
				}
			}
			if ($this->page_max > ($this->block + 1) * $this->scale)
			{
				$next_block = ($this->block + 1) * $this->scale + 1;
				$amp = ($this->tails) ? '&' : '';
				$op .= "<a href=\"./?{$this->tails}{$amp}page={$next_block}\" title=\"Next\" class=\"next\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z\"/></svg></a>\n";
			}
			else
			{
				$op .= '';
			}
			$op .= "</nav>\n";
		}

		return $op;
	}

	/**
	 * Make navigation to object
	 *
	 * @return object
	 */
	public function createNavigationToObject()
	{
		$result = null;

		if ($this->total > $this->size)
		{
			$result = (object)[
				'prev' => null,
				'next' => null,
				'body' => null,
			];

			if ($this->block > 0)
			{
				$prev_block = ($this->block - 1) * $this->scale + 1;
				$str = ($prev_block == 1) ? "" : "page=$prev_block";
				$amp = ($this->tails && $str) ? "&" : "";
				$str = ($str || $this->tails) ? $this->tails.$amp.$str : "";
				$result->prev = (object)[
					'name' => 'prev',
					'id' => $prev_block,
					'url' => $str,
				];
			}

			$this->start_page = $this->block * $this->scale + 1;

			for ($i=1; $i<=$this->scale && $this->start_page<=$this->page_max; $i++, $this->start_page++)
			{
				$k = $i - 1;
				if ($this->start_page == $this->page)
				{
					$result->body[$k] = (object)[
						'id' => $this->start_page,
						'name' => $this->start_page,
						'active' => true,
					];
				}
				else
				{
					$str = ($this->start_page == 1) ? "" : "page=$this->start_page";
					$amp = ($this->tails && $str) ? "&" : "";
					$str = ($str || $this->tails) ? $this->tails.$amp.$str : "";
					$result->body[$k] = (object)[
						'id' => $this->start_page,
						'name' => $this->start_page,
						'url' => $str,
					];
				}
			}

			if ($this->page_max > ($this->block + 1) * $this->scale)
			{
				$next_block = ($this->block + 1) * $this->scale + 1;
				$amp = ($this->tails) ? "&" : "";
				$result->next = (object)[
					'name' => 'next',
					'id' => $next_block,
					'url' => "{$this->tails}{$amp}page={$next_block}",
				];
			}
		}
		else
		{
			$result = null;
		}

		return ($result) ? $result : null;
	}
}